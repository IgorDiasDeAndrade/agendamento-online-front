import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import ScheduleInfos from '../scheduleInfos';
import ScheduledPatients from '../scheduledPatients';
import { API } from 'src/configs/auth';
import CloseIcon from '@mui/icons-material/Close';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

const closeIconStyle = {
    position: 'absolute',
    right: 30,
    top: 25
}

export default function PreviewModal({ id }) {
    const [open, setOpen] = React.useState(false);
    const [infos, setInfos] = React.useState();
    const [patients, setPatients] = React.useState();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    React.useEffect(() => {

        async function loadAgenda(id) {
            const token = window.sessionStorage.getItem('accessToken')
            try {
                const { data } = await API.get(`/agenda/patients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setInfos(data.agenda[0])
                setPatients(data.patients)
            } catch (error) {
                console.log(error.message)
            }
        }

        loadAgenda(id)

    }, [])
    return (
        <div>
            <IconButton
                size='small'
                sx={{ color: 'text.secondary' }}
                onClick={handleOpen}
            >
                <Icon icon='tabler:eye' />
            </IconButton>
            {infos && <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <CloseIcon sx={closeIconStyle} onClick={handleClose} />
                        <Box sx={{ display: 'flex', gap: 5 }} >
                            <ScheduleInfos infos={infos} modal={true} />
                            <ScheduledPatients patients={patients} modal={true} />
                        </Box>
                    </Box>
                </Fade>
            </Modal>}
        </div>
    );
}