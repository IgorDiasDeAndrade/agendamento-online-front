// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/invoice'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { setCurrentUser } from 'src/store/apps/currentUser'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars
const invoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler:circle-check' },
  Paid: { color: 'success', icon: 'tabler:circle-half-2' },
  Draft: { color: 'primary', icon: 'tabler:device-floppy' },
  'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
  'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' }
}

// ** renders client column

const renderClient = row => {
  return (
    <CustomAvatar
      skin='light'
      color={'primary'}
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row.agenda_name || 'John Doe')}
    </CustomAvatar>
  )
}

const defaultColumns = [
  {
    flex: 0.1,
    field: 'agenda_id',
    minWidth: 100,
    headerName: 'ID',
    renderCell: ({ row }) => (
      <Typography
        component={LinkStyled}
        href={`/apps/invoice/preview/${row.agenda_id}`}
      >{`#${row.agenda_id}`}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'is_active',
    renderHeader: () => <Icon icon='tabler:trending-up' />,
    renderCell: ({ row }) => {
      const { additional_slots, slots_available, is_active } = row
      const color = is_active ? 'success' : 'error'

      return (
        <Tooltip
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Agenda:
              </Typography>{' '}
              {is_active ? 'Ativa' : 'Inativa'}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Vagas:
              </Typography>{' '}
              {slots_available}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Encaixes:
              </Typography>{' '}
              {additional_slots}
            </div>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
            <Icon icon={is_active ? 'tabler:circle-check' : 'tabler:alert-circle'} />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.25,
    field: 'agenda_name',
    minWidth: 200,
    headerName: 'Nome',
    renderCell: ({ row }) => {
      const { agenda_name, procedure_type } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {agenda_name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {procedure_type}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 130,
    field: 'start_time',
    headerName: 'Horário',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{`${row.start_time.slice(0, 5)} até ${row.end_time.slice(
        0,
        5
      )}`}</Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'date',
    headerName: 'Data',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.date.slice(0, 10)}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'slot_available',
    headerName: 'Vagas',
    renderCell: ({ row }) => {
      return row.slots_available !== 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>{row.slots_available}</Typography>
      ) : (
        <CustomChip rounded size='small' skin='light' color='success' label='Paid' />
      )
    }
  }
]
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

/* eslint-enable */
const UserPanel = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.invoice)
  const currentUser = useSelector(state => state.currentUser)
  const storageTokenKeyName = 'accessToken'

  useEffect(() => {
    if (!currentUser) {
      dispatch(setCurrentUser({ token: window.sessionStorage.getItem(storageTokenKeyName) }))
    }

    dispatch(
      fetchData({
        dates,
        q: value,
        status: statusValue
      })
    )
  }, [dispatch, statusValue, value, dates, currentUser])

  const handleFilter = val => {
    setValue(val)
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => dispatch(deleteInvoice(row.agenda_id))}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/apps/invoice/preview/${row.agenda_id}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='tabler:download' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/apps/invoice/edit/${row.id}`,
                icon: <Icon icon='tabler:edit' fontSize={20} />
              },
              {
                text: 'Duplicate',
                icon: <Icon icon='tabler:copy' fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ]
  const getRowId = row => row.agenda_id

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Status da agenda'
                    SelectProps={{ value: statusValue, onChange: e => handleStatusValue(e) }}
                  >
                    <MenuItem value=''>Sem fitro</MenuItem>
                    <MenuItem value='true'>Filtrar por ativas</MenuItem>
                    <MenuItem value='false'>Filtrar por inativas</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Invoice Date'
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            <DataGrid
              getRowId={getRowId}
              autoHeight
              pagination
              rowHeight={62}
              rows={store.data}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default UserPanel
