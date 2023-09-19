// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { format } from 'date-fns'

const data = {
    id: 1,
    role: 'admin',
    status: 'active',
    username: 'gslixby0',
    avatarColor: 'primary',
    country: 'El Salvador',
    company: 'Yotz PVT LTD',
    billing: 'Manual - Cash',
    contact: '(479) 232-9151',
    currentPlan: 'enterprise',
    fullName: 'Daisy Patterson',
    email: 'gslixby0@abc.net.au',
    avatar: '/images/avatars/14.png'
}

const roleColors = {
    admin: 'error',
    editor: 'info',
    author: 'warning',
    maintainer: 'success',
    subscriber: 'primary'
}

const statusColors = {
    true: 'success',
    false: 'warning',
    // false: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
    top: 0,
    left: -10,
    position: 'absolute',
    color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
    alignSelf: 'flex-end',
    color: theme.palette.text.disabled,
    fontSize: theme.typography.body1.fontSize
}))

const ScheduleInfos = ({ infos }) => {
    // ** States
    const [openEdit, setOpenEdit] = useState(false)
    const [openPlans, setOpenPlans] = useState(false)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)

    // Handle Edit dialog
    const handleEditClickOpen = () => setOpenEdit(true)
    const handleEditClose = () => setOpenEdit(false)

    // Handle Upgrade Plan dialog
    const handlePlansClickOpen = () => setOpenPlans(true)
    const handlePlansClose = () => setOpenPlans(false)
    if (infos) {
        console.log(infos)
        return (
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>

                        <Divider sx={{ my: '0 !important', mx: 6 }} />

                        <CardContent sx={{ pb: 4, width: 300 }}>
                            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                                Detalhes
                            </Typography>
                            <Box sx={{ pt: 4 }}>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Nome da agenda:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{infos.agenda_name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Tipo de horário:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{infos.agenda_type == 1 ? "Fixo" : "Fracionado"}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                                    <CustomChip
                                        rounded
                                        skin='light'
                                        size='small'
                                        label={infos.is_active ? "Ativo" : "Inativo"}
                                        color={statusColors[infos.is_active]}
                                        sx={{
                                            textTransform: 'capitalize'
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Data:</Typography>
                                    <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{format(new Date(infos.date), 'dd/MM/yyyy')}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Início:</Typography>
                                    <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{infos.start_time}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Fim:</Typography>
                                    <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{infos.end_time}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Vagas:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{infos.slots_available}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Encaixes:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{infos.additional_slots}</Typography>
                                </Box>
                            </Box>
                        </CardContent>

                        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                                Editar
                            </Button>
                        </CardActions>

                        {/* <Dialog
                            open={openEdit}
                            onClose={handleEditClose}
                            aria-labelledby='user-view-edit'
                            aria-describedby='user-view-edit-description'
                            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
                        >
                            <DialogTitle
                                id='user-view-edit'
                                sx={{
                                    textAlign: 'center',
                                    fontSize: '1.5rem !important',
                                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                                }}
                            >
                                Edit User Information
                            </DialogTitle>
                            <DialogContent
                                sx={{
                                    pb: theme => `${theme.spacing(8)} !important`,
                                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                                }}
                            >
                                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                                    Updating user details will receive a privacy audit.
                                </DialogContentText>
                                <form>
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField
                                                fullWidth
                                                label='Full Name'
                                                placeholder='John Doe'
                                                defaultValue={data.fullName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField
                                                fullWidth
                                                label='Username'
                                                placeholder='John.Doe'
                                                defaultValue={data.username}
                                                InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField
                                                fullWidth
                                                type='email'
                                                label='Billing Email'
                                                defaultValue={data.email}
                                                placeholder='john.doe@gmail.com'
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField select fullWidth label='Status' defaultValue={data.status}>
                                                <MenuItem value='pending'>Pending</MenuItem>
                                                <MenuItem value='active'>Active</MenuItem>
                                                <MenuItem value='inactive'>Inactive</MenuItem>
                                            </CustomTextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField fullWidth label='TAX ID' defaultValue='Tax-8894' placeholder='Tax-8894' />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField
                                                fullWidth
                                                label='Contact'
                                                placeholder='723-348-2344'
                                                defaultValue={`+1 ${data.contact}`}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField select fullWidth label='Language' defaultValue='English'>
                                                <MenuItem value='English'>English</MenuItem>
                                                <MenuItem value='Spanish'>Spanish</MenuItem>
                                                <MenuItem value='Portuguese'>Portuguese</MenuItem>
                                                <MenuItem value='Russian'>Russian</MenuItem>
                                                <MenuItem value='French'>French</MenuItem>
                                                <MenuItem value='German'>German</MenuItem>
                                            </CustomTextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <CustomTextField select fullWidth label='Country' defaultValue='USA'>
                                                <MenuItem value='USA'>USA</MenuItem>
                                                <MenuItem value='UK'>UK</MenuItem>
                                                <MenuItem value='Spain'>Spain</MenuItem>
                                                <MenuItem value='Russia'>Russia</MenuItem>
                                                <MenuItem value='France'>France</MenuItem>
                                                <MenuItem value='Germany'>Germany</MenuItem>
                                            </CustomTextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                label='Use as a billing address?'
                                                control={<Switch defaultChecked />}
                                                sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </form>
                            </DialogContent>
                            <DialogActions
                                sx={{
                                    justifyContent: 'center',
                                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                                }}
                            >
                                <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClose}>
                                    Submit
                                </Button>
                                <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog> */}
                    </Card>
                </Grid>
            </Grid>
        )
    } else {
        return null
    }
}

export default ScheduleInfos
