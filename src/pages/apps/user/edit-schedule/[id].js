// ** Third Party Imports
import axios from 'axios'


// ** Styled Component
import { API } from 'src/configs/auth'
import { useEffect, useReducer, useState } from 'react'
import { Box } from '@mui/system'
import ScheduleInfos from '../panel/scheduleInfos'
import InsertPatient from '../panel/insert-patient-agenda'
import ScheduledPatients from '../panel/scheduledPatients'


const InvoiceEdit = ({ id }) => {
    const [infos, setInfos] = useState();
    const [patients, setPatients] = useState();
    const token = window.sessionStorage.getItem('accessToken')

    useEffect(() => {
        if (id) {
            sessionStorage.setItem('agenda_id', id)
        } else {
            id = sessionStorage.getItem('agenda_id')
        }
        async function loadAgenda(id) {
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
        <Box sx={{ display: 'flex', gap: 8 }}>
            {patients && <><ScheduleInfos infos={infos} />
                <Box sx={{ width: '80%' }}>
                    <InsertPatient id={infos.agenda_id} name={infos.agenda_name} />
                    <ScheduledPatients patients={patients} />
                </Box></>}
        </Box>
    )
}

export const getStaticPaths = async () => {
    const res = await axios.get('/apps/invoice/invoices')
    const data = await res.data.allData

    const paths = data.map(item => ({
        params: { id: `${item.id}` }
    }))

    return {
        paths,
        fallback: true
    }
}

export const getStaticProps = async (params) => {
    return {
        props: {
            id: params.params.id
        }
    }
}



export default InvoiceEdit
