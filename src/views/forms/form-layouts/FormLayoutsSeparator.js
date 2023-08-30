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
import { API } from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CustomInput = forwardRef((props, ref) => {
  return <CustomTextField fullWidth {...props} inputRef={ref} label='Data da agenda' autoComplete='off' />
})

const FormLayoutsSeparator = () => {
  // ** States
  const [date, setDate] = useState(null)
  const [language, setLanguage] = useState([])

  const [values, setValues] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })

  // Handle Password
  const handlePasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  // Handle Confirm Password
  const handleConfirmChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }

  // Handle Select
  const handleSelectChange = event => {
    setLanguage(event.target.value)
  }

  const handleTimeChange = event => {
    setValues(...values, event.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Montar os dados a serem enviados
    const formData = {
      agenda_name: values.agenda_name,
      procedure_type: values.procedure_type,
      date: values.date,
      firstName: values.firstName,
      lastName: values.lastName,
      country: values.country,
      language: language,
      date: date,
      phoneNumber: values.phoneNumber
    }

    try {
      const response = await API.post('/agenda', formData)

      console.log('Resposta da API:', response.data)
    } catch (error) {
      console.error('Erro ao enviar os dados:', error)
    }
  }

  return (
    <Card>
      <CardHeader title='Adicionar agenda' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                name='agenda_name'
                label='Nome da Agenda'
                placeholder='Agenda do Dr. Jefferson'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth name='procedure_type' label='Tipo de procedimento' placeholder='Cirurgia' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimeField label='Início' name='start_time' value={values.start_time} format='HH:mm' sx={{ ml: 6 }} />
                <TimeField label='Fim' name='end_time' value={values.end_time} format='HH:mm' sx={{ ml: 6 }} />
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
              <CustomTextField fullWidth name='slots_available' type='number' label='Máx. vagas' placeholder='20' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth name='additional_slots' type='number' label='Máx. encaixes' placeholder='5' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                name='agenda_type'
                label='Tipo de agenda'
                id='form-layouts-separator-select'
                defaultValue='2'
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
