import { useQuery } from '@tanstack/react-query'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { BsPlus } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router'
import { customFetcher } from '../../helpers/customFetcher'
import { BackButton } from '../components/BackButton'

export type CreateCollectionViewProps = {
    editing?: boolean
}

export const CreateCollectionView = ({ editing }: CreateCollectionViewProps) => {
    const navigate = useNavigate()
    const { colId } = useParams()

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

                    if (editing && colId) {
                        await customFetcher(`/collections/${colId}`, {
                            method: 'PUT',
                            body: JSON.stringify(values),
                        })
                    } else {
                        await customFetcher('/collections', {
                            method: 'POST',
                            body: JSON.stringify(values),
                        })
                    }

                    setSubmitting(false)
                    navigate('/')
                }}
            >
                {({ isSubmitting, setValues }) => {
                    const { data: existingCollection } = useQuery(
                        ['collections', colId],
                        () => {
                            if (editing && colId) {
                                return customFetcher(`/collections/${colId}`)
                            } else {
                                return undefined
                            }
                        },
                        {
                            onSuccess: (col) => {
                                setValues((prev) => {
                                    const newValues: any = prev
                                    for (const [key, value] of Object.entries(prev)) {
                                        if (!value) {
                                            newValues[key] = col[key] ?? ''
                                        }
                                    }
                                    return newValues
                                })
                            },
                        }
                    )

                    return (
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
                    )
                }}
            </Formik>
        </section>
    )
}
