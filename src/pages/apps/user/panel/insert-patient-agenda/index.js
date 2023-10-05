import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { CardActions, Divider, Grid } from '@mui/material';
import CustomTextField from 'src/@core/components/mui/text-field';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getHours, getMinutes } from 'date-fns';
import { API } from 'src/configs/auth';
import { TimePicker } from '@mui/x-date-pickers';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const divStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: 'red'
}



export default function InsertPatient({ id, name }) {
    const [open, setOpen] = React.useState(false);
    const [appointment_time, setAppointment_time] = React.useState('')
    const [patient_cpf, setPatient_cpf] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState('')

    const [errors, setErrors] = React.useState({ cpf: false, message: false })

    const reload = () => window.location.reload();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setAppointment_time('')
        setPatient_cpf('')
        resetErrors()
        setOpen(false);
    };

    const handleSubmit = async e => {
        e.preventDefault()
        resetErrors()

        if (patient_cpf === '' || patient_cpf.length !== 11) {
            setErrors({ ...errors, cpf: true })
            return;
        }
        if (appointment_time === '') {
            setErrorMessage('Horário obrigatório')
            setErrors({ ...errors, message: true })
            return;
        }

        const token = window.sessionStorage.getItem('accessToken')
        try {
            const response = await API.post('/agenda/patient/insert', { agenda_id: id, patient_cpf, appointment_time }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            handleClose();
            reload();
        } catch (error) {
            console.error('Erro ao enviar os dados:', error)
            setErrorMessage(error.response.data.message)
            setErrors({ ...errors, message: true })
        }
    }

    const handleErrors = (e) => {
        if (e.target.value === '') {
            setErrors({ ...errors, [e.target.name]: true })
        } else {
            setErrors({ ...errors, [e.target.name]: false })
        }
    }

    const resetErrors = () => {
        setErrors({ cpf: false, time: false })
    }
    return (
        <div>
            <Button sx={{ mb: 2 }} onClick={handleOpen} variant='contained' >
                Adicionar paciente
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 600 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} sx={{ marginBottom: 8 }}>
                                <CustomTextField fullWidth
                                    label='Nome da agenda'
                                    name='name'
                                    value={name}
                                    InputProps={{
                                        readOnly: true,
                                    }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} sx={{ paddingBottom: 4 }}>
                                <CustomTextField fullWidth required type='number' label='CPF do paciente' placeholder='12345678910' name='cpf' value={patient_cpf} onChange={e => setPatient_cpf(e.target.value)}
                                    onBlur={e => handleErrors(e)}
                                    error={errors.cpf}
                                    helperText={errors.cpf ? 'Obrigatório CPF com 11 digitos' : ''}
                                />
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={12} sm={6}>
                                    <TimePicker view='hours'
                                        label='Selecione o horário *'
                                        minTime={new Date(0, 0, 0, 8)}
                                        maxTime={new Date(0, 0, 0, 18)}
                                        ampm={false}
                                        minutesStep={15}
                                        skipDisabled
                                        required
                                        onChange={(e) => setAppointment_time(`${getHours(new Date(e))}:${getMinutes(new Date(e))}:00`)}
                                    />
                                </Grid>
                                {errors.message && <div style={...divStyle}><span>{errorMessage}</span></div>}
                            </LocalizationProvider>
                        </Grid>
                        <Divider sx={{ m: '0 !important' }} />
                        <CardActions>
                            <Button type='submit' sx={{ mr: 2 }} variant='contained'>
                                Inserir
                            </Button>
                            <Button type='reset' color='secondary' variant='tonal' onClick={handleClose}>
                                Cancelar
                            </Button>
                        </CardActions>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}