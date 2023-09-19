import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import ScheduleInfos from '../scheduleInfos';
import ScheduledPatients from '../scheduledPatients';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    height: 528,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    gap: 5
};

export default function PreviewModal({ infos }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton
                size='small'
                sx={{ color: 'text.secondary' }}
                onClick={handleOpen}
            >
                <Icon icon='tabler:eye' />
            </IconButton>
            <Modal
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
                        <ScheduleInfos infos={infos} />
                        <ScheduledPatients />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}