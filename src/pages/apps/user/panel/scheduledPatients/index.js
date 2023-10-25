// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { IconButton, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { API } from 'src/configs/auth'


const escapeRegExp = value => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function cpfMask(v) {
    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")

    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return v
}

const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{2})(\d)/, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
    return value
}





const ScheduledPatients = ({ patients, modal }) => {
    const [data] = useState(patients)
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
    console.log(patients)

    const columns = modal ? [
        {
            flex: 0.1,
            field: 'hour',
            minWidth: 100,
            headerName: 'Horário',
            renderCell: params => {
                return (
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        {params.row.appointment_time}
                    </Typography>
                )
            }
        },
        {
            flex: 0.3,
            minWidth: 190,
            field: 'full_name',
            headerName: 'Nome',
            renderCell: params => {
                const { row } = params

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {row.name}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 140,
            headerName: 'CPF',
            field: 'cpfnumber',
            renderCell: params => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {cpfMask(params.row.cpf)}
                </Typography>
            )
        },
        {
            flex: 0.2,
            minWidth: 140,
            field: 'contact',
            headerName: 'Contato',
            renderCell: params => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {phoneMask(params.row.contact_number_1)}
                </Typography>
            )
        }
    ] : [
        {
            flex: 0.1,
            field: 'hour',
            minWidth: 100,
            headerName: 'Horário',
            renderCell: params => {
                return (
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        {params.row.appointment_time}
                    </Typography>
                )
            }
        },
        {
            flex: 0.3,
            minWidth: 190,
            field: 'full_name',
            headerName: 'Nome',
            renderCell: params => {
                const { row } = params

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {row.name}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 140,
            headerName: 'CPF',
            field: 'cpfnumber',
            renderCell: params => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {cpfMask(params.row.cpf)}
                </Typography>
            )
        },
        {
            flex: 0.2,
            minWidth: 140,
            field: 'contact',
            headerName: 'Contato',
            renderCell: params => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {phoneMask(params.row.contact_number_1)}
                </Typography>
            )
        },
        {
            flex: 0.1,
            minWidth: 20,
            field: 'remove',
            headerName: "Remover",
            renderCell: params => (
                <Tooltip title='Delete Patient'>
                    <IconButton
                        size='small'
                        sx={{ color: 'text.secondary' }}
                        onClick={() => removePatient(params.row.id)}
                    >
                        <Icon icon='tabler:trash' />
                    </IconButton>
                </Tooltip>
            )
        }
    ]

    const removePatient = async (patient_id) => {
        const id = window.sessionStorage.getItem('agenda_id');
        const token = window.sessionStorage.getItem('accessToken')

        try {
            await API.delete(`/agenda/patient/${id}`, {
                data: { patient_id },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            window.location.reload();
        } catch (error) {
            console.log(error)
        }

    }

    const handleSearch = searchValue => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

        const filteredRows = data.filter(row => {
            return Object.keys(row).some(field => {
                // @ts-ignore
                return searchRegex.test(row[field])
            })
        })
        if (searchValue.length) {
            setFilteredData(filteredRows)
        } else {
            setFilteredData([])
        }
    }

    return (
        <Card>
            <CardHeader title='Pacientes' />
            <DataGrid
                autoHeight
                columns={columns}
                pageSizeOptions={[7, 10, 25]}
                paginationModel={paginationModel}
                slots={{ toolbar: QuickSearchToolbar }}
                onPaginationModelChange={setPaginationModel}
                rows={filteredData.length ? filteredData : data}
                sx={{
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.125rem',
                    }
                }}
                slotProps={{
                    baseButton: {
                        visibility: 'hidden',
                        size: 'medium',
                        variant: 'outlined'
                    },
                    toolbar: {
                        showQuickFilter: false,
                        value: searchText,
                        clearSearch: () => handleSearch(''),
                        onChange: event => handleSearch(event.target.value)
                    }
                }}
            />
        </Card>
    )
}

export default ScheduledPatients
