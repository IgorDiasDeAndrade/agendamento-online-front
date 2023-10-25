// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Edit from 'src/views/apps/invoice/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'


const InvoiceEdit = ({ id }) => {
  return (
    // <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
    //   <Edit id={id} />
    // </DatePickerWrapper>
    <h1>teste</h1>
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

// export const getStaticProps = async ({ params }) => {
//   console.log(params)
//   return {
//     props: {
//       id: params?.id
//     }
//   }
// }


export async function getStaticProps(context) {
  const { params } = context;
  const id = params.id;

  const data = id

  return {
    props: data,
  }
}

export default InvoiceEdit
