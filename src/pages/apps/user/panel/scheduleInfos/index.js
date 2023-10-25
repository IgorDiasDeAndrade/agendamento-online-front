// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Icon Imports

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditScheduleInfos from '../../edit-schedule-infos'


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

const ScheduleInfos = ({ infos, modal }) => {
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
        return (
            <Grid container spacing={6} sx={{ width: 300 }}>
                <Grid item xs={12}>
                    <Card>

                        <Divider sx={{ my: '0 !important', mx: 6 }} />

                        <CardContent sx={{ pb: 4 }}>
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
                            {infos.is_active ? modal ? <Link href={`/apps/user/edit-schedule/${infos.agenda_id}`}><Button variant='contained' sx={{ mr: 2 }}>
                                Editar
                            </Button></Link> :
                                <EditScheduleInfos infos={infos} /> : ''}

                        </CardActions>

                    </Card>
                </Grid>
            </Grid>
        )
    } else {
        return null
    }
}

export default ScheduleInfos
