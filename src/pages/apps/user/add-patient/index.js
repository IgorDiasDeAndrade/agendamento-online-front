import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { CardActions, Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup } from '@mui/material';
import CustomTextField from 'src/@core/components/mui/text-field';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { API } from 'src/configs/auth';
import { cpf } from 'cpf-cnpj-validator'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const divStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: 'red',
    marginTop: 3
}

const estados = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
];


export default function AddPatient() {
    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('')
    const [data, setData] = React.useState('');
    const [form, setForm] = React.useState({
        cpf: '',
        name: '',
        birthday: '',
        mothers_name: '',
        fathers_name: '',
        contact_number_1: '',
        contact_number_2: '',
        obs: '',
        zip_code: '',
        address: '',
        complement: '',
        neighborhood: '',
        location: '',
        number: '',
        uf: ''
    })

    const [errors, setErrors] = React.useState({ cpf: false, name: false, birthday: false, contact_number_1: false, message: false })


    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        resetForm();
        resetErrors()
        setOpen(false);
    };

    const resetForm = () => {
        setData('')
        resetErrors()
        setForm({
            cpf: '',
            name: '',
            birthday: '',
            mothers_name: '',
            fathers_name: '',
            contact_number_1: '',
            contact_number_2: '',
            obs: '',
            zip_code: '',
            address: '',
            complement: '',
            neighborhood: '',
            location: '',
            number: '',
            uf: ''
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        resetErrors();

        if (form.name === '' || form.cpf === '' || form.cpf.length !== 11 || form.birthday === '' || form.contact_number_1 === '' || form.contact_number_1.length !== 11) {
            setErrors({ cpf: true, name: true, birthday: true, contact_number_1: true })
            return;
        }

        if (!cpf.isValid(form.cpf)) {
            setErrorMessage('CPF inválido!')
            setErrors({ ...errors, message: true })
            return;
        }

        const token = window.sessionStorage.getItem('accessToken')
        try {
            const response = await API.post('/patient', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            handleClose();
        } catch (error) {
            console.error('Erro ao enviar os dados:', error)
            setErrorMessage('CPF já cadastrado!')
            setErrors({ ...errors, message: true })
        }
    }

    function handleChangeForm(e) {
        const value = e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleErrors = (e) => {
        if (e.target.value === '') {
            setErrors({ ...errors, [e.target.name]: true })
        } else {
            setErrors({ ...errors, [e.target.name]: false })
        }
    }

    const resetErrors = () => {
        setErrors({ cpf: false, name: false, birthday: false, contact_number_1: false })
    }

    return (
        <div>
            <Button sx={{ mb: 2 }} onClick={handleOpen} variant='contained' >
                Cadastrar paciente
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 600 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={5} sx={{ paddingBottom: 4 }}>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField fullWidth
                                    required
                                    label='Nome Completo'
                                    placeholder='Leonard Carter'
                                    name='name'
                                    value={form.name}
                                    onChange={e => handleChangeForm(e)}
                                    onBlur={e => handleErrors(e)}
                                    error={errors.name}
                                    helperText={errors.name ? 'Obrigatório' : ''} />
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        required
                                        label="Data de Nascimento *"
                                        value={data}
                                        disableFuture
                                        showYearDropdown
                                        showMonthDropdown
                                        inputFormat='dd/MM/yyyy'
                                        placeholderText='DD-MM-YYYY'
                                        name='birthday' onChange={e => { form.birthday = format(new Date(e), 'yyyy-MM-dd'), setData(e) }}

                                    />
                                </Grid>
                            </LocalizationProvider>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField fullWidth required type='number' label='CPF' placeholder='12345678910' name='cpf' value={form.cpf} onChange={e => handleChangeForm(e)}
                                    onBlur={e => handleErrors(e)}
                                    error={errors.cpf}
                                    helperText={errors.cpf ? 'Obrigatório CPF com 11 digitos' : ''} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField fullWidth label='Nome da Mãe' placeholder='Nome da mãe' name='mothers_name' value={form.mothers_name} onChange={e => handleChangeForm(e)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField fullWidth label='Nome do Pai' placeholder='Nome do pai' name='fathers_name' value={form.fathers_name} onChange={e => handleChangeForm(e)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField fullWidth required type='number' label='Tel. Contato' placeholder='12 12345-6789' name='contact_number_1' value={form.contact_number_1} onChange={e => handleChangeForm(e)}
                                    onBlur={e => handleErrors(e)}
                                    error={errors.contact_number_1}
                                    helperText={errors.contact_number_1 ? 'Obrigatório telefone com DDD' : ''} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTextField fullWidth type='number' label='Tel. Contato 2' placeholder='12 12345-6789' name='contact_number_2' value={form.contact_number_2} onChange={e => handleChangeForm(e)} />
                            </Grid>
                            <Grid container spacing={5} margin={1}>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField fullWidth label='Endereço' placeholder='Rua Dois de Março' name='address' value={form.address} onChange={e => handleChangeForm(e)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField type='number' label='Número' placeholder='123' name='number' value={form.number} onChange={e => handleChangeForm(e)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField fullWidth label='Complemento' placeholder='Casa 2, lote 10' name='complement' value={form.complement} onChange={e => handleChangeForm(e)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField fullWidth label='Bairro' placeholder='Lote XV' name='neighborhood' value={form.neighborhood} onChange={e => handleChangeForm(e)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField fullWidth label='Município' placeholder='Belford Roxo' name='location' value={form.location} onChange={e => handleChangeForm(e)} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <CustomTextField select label='Estado' id='form-layouts-collapsible-select' defaultValue='' name='uf' value={form.uf} onChange={e => handleChangeForm(e)}>
                                        {estados.map(estado => (
                                            <MenuItem value={estado}>{estado}</MenuItem>
                                        ))}

                                    </CustomTextField>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <CustomTextField multiline rows={3} fullWidth label='Obs:' placeholder='Observações' name='obs' value={form.obs} onChange={e => handleChangeForm(e)} />
                            </Grid>
                            {errors.message && <div style={...divStyle}><span>{errorMessage}</span></div>}
                        </Grid>
                        <Divider sx={{ m: '0 !important' }} />
                        <CardActions>
                            <Button type='submit' sx={{ mr: 2 }} variant='contained'>
                                Cadastrar
                            </Button>
                            <Button type='reset' color='secondary' variant='tonal' onClick={resetForm}>
                                Resetar
                            </Button>
                        </CardActions>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}