// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { TimeField } from '@mui/x-date-pickers/TimeField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { API } from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { redirect } from 'next/navigation'
import { Router, useRouter } from 'next/router'

const CustomInput = forwardRef((props, ref) => {
  return <CustomTextField fullWidth {...props} inputRef={ref} label='Data da agenda' autoComplete='off' />
})

const FormLayoutsSeparator = () => {
  // ** States
  const [date, setDate] = useState(null)
  const [start_time, setStartTime] = useState(null)
  const [end_time, setEndTime] = useState(null)
  const router = useRouter();

  const [form, setForm] = useState({
    agenda_name: '',
    agenda_type: '',
    procedure_type: '',
    slots_available: '',
    additional_slots: '',
    is_active: false
  })

  function handleChangeForm(e) {
    const value = e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      agenda_name: form.agenda_name,
      agenda_type: form.agenda_type,
      procedure_type: form.procedure_type,
      start_time: format(new Date(start_time), 'HH:mm'),
      end_time: format(new Date(end_time), 'HH:mm'),
      date: format(new Date(date), 'yyyy-MM-dd'),
      slots_available: form.slots_available,
      additional_slots: form.additional_slots,
      is_active: false
    }

    const token = window.sessionStorage.getItem('accessToken')

    try {
      const response = await API.post('/agenda', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response) {
        router.push('/apps/user/panel/')
      }

    } catch (error) {
      console.error('Erro ao enviar os dados:', error)
    }

  }

  return (
    <Card>
      <CardHeader title='Adicionar agenda' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                name='agenda_name'
                value={form.agenda_name}
                label='Nome da Agenda'
                placeholder='Agenda do Dr. Jefferson'
                onChange={e => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                name='procedure_type'
                value={form.procedure_type}
                label='Tipo de procedimento'
                placeholder='Cirurgia'
                onChange={e => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimeField
                  label='Início'
                  name='start_time'
                  value={start_time}
                  format='HH:mm'
                  onChange={newValue => setStartTime(newValue)}
                  sx={{ ml: 6 }}
                />
                <TimeField
                  label='Fim'
                  name='end_time'
                  value={end_time}
                  format='HH:mm'
                  onChange={newValue => setEndTime(newValue)}
                  sx={{ ml: 6 }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                dateFormat='dd/MM/yyyy'
                placeholderText='DD-MM-YYYY'
                customInput={<CustomInput />}
                id='form-layouts-separator-date'
                onChange={date => setDate(date)}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                name='slots_available'
                value={form.slots_available}
                type='number'
                label='Máx. vagas'
                placeholder='20'
                onChange={e => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                value={form.additional_slots}
                name='additional_slots'
                type='number'
                label='Máx. encaixes'
                placeholder='5'
                onChange={e => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                value={form.agenda_type}
                name='agenda_type'
                label='Tipo de agenda'
                id='form-layouts-separator-select'
                defaultValue='2'
                onChange={e => handleChangeForm(e)}
              >
                <MenuItem value='1'>Horários fracionados</MenuItem>
                <MenuItem value='2'>Horários fixos</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
          <Button type='reset' color='secondary' variant='tonal'>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
