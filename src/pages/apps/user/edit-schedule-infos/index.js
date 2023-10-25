import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Card, CardActions, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup } from '@mui/material';
import CustomTextField from 'src/@core/components/mui/text-field';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, setHours } from 'date-fns';
import { API } from 'src/configs/auth';
import { useState } from 'react';
import { TimeField } from '@mui/x-date-pickers';

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


const CustomInput = React.forwardRef((props, ref) => {
    return <CustomTextField fullWidth {...props} inputRef={ref} label='Data da agenda' autoComplete='off' />
})


export default function EditScheduleInfos({ infos }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date(infos.date))
    const [start_time, setStartTime] = useState(new Date(infos.date).setHours(infos.start_time.slice(0, 2), infos.start_time.slice(3, 5)))
    const [end_time, setEndTime] = useState(new Date(infos.date).setHours(infos.end_time.slice(0, 2), infos.end_time.slice(3, 5)))
    const [form, setForm] = useState({
        agenda_name: infos.agenda_name,
        agenda_type: infos.agenda_type,
        procedure_type: infos.procedure_type,
        slots_available: infos.slots_available,
        additional_slots: infos.additional_slots
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
            is_active: infos.is_active
        }
        const token = window.sessionStorage.getItem('accessToken')

        try {
            const response = await API.put(`/agenda/${infos.agenda_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            window.location.reload()
        } catch (error) {
            console.error('Erro ao enviar os dados:', error)
        }
    }


    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleOpen}>
                Editar
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 600 }}>
                    <Card>
                        <CardHeader title='Editar agenda' />
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
                                    <Grid item xs={12} sm={6} sx={{ display: 'flex', marginLeft: -5 }}>
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
                                    <Grid item xs={12} sm={6} sx={{ marginLeft: 5 }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                selected={date}
                                                showYearDropdown
                                                showMonthDropdown
                                                value={date}
                                                dateFormat='dd/MM/yyyy'
                                                placeholderText='DD-MM-YYYY'
                                                customInput={<CustomInput />}
                                                id='form-layouts-separator-date'
                                                onChange={date => setDate(date)}
                                            />
                                        </LocalizationProvider>
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
                                    Confirmar
                                </Button>
                                <Button type='reset' color='secondary' variant='tonal' onClick={handleClose}>
                                    Fechar
                                </Button>
                            </CardActions>
                        </form>
                    </Card>
                </Box>
            </Modal>
        </div >
    );
}