import { ErrorMessage, Field, Form, Formik } from 'formik'
import { BsPlus } from 'react-icons/bs'
import { useNavigate } from 'react-router'
import { customFetcher } from '../../helpers/customFetcher'
import { BackButton } from '../components/BackButton'

export const CreateCollectionsView = () => {
    const navigate = useNavigate()

    return (
        <section className='flex-grow-1 flex-column d-flex overflow-hidden'>
            <BackButton backTo='/' />

            <h4 className='mb-0 mt-2'>New Collection</h4>

            <Formik
                initialValues={{
                    name: '',
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)

                    await customFetcher('/collections', {
                        method: 'POST',
                        body: JSON.stringify(values),
                    })

                    setSubmitting(false)
                    navigate('/')
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className='form-group'>
                            <label htmlFor='name'>Name</label>
                            <Field
                                className='form-control'
                                id='name'
                                type='text'
                                name='name'
                                placeholder='Name your collection'
                            />
                            <ErrorMessage name='name' />
                        </div>

                        <button
                            className='btn btn-primary container mt-2'
                            type='submit'
                            disabled={isSubmitting}
                        >
                            <BsPlus />
                        </button>
                    </Form>
                )}
            </Formik>
        </section>
    )
}
