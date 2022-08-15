import { useQuery } from '@tanstack/react-query'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { BsPlus } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router'
import { createCollection, getCollection, updateCollection } from '../../shared/actions'
import { ICollection } from '../../shared/entities/ICollection'
import { BackButton } from '../components/BackButton'
import { sendMessage } from '../lib/sendMessage'

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
                        await sendMessage(updateCollection(values))
                    } else {
                        await sendMessage(createCollection(values))
                    }

                    setSubmitting(false)
                    navigate('/')
                }}
            >
                {({ isSubmitting, setValues }) => {
                    useQuery(
                        ['collections', colId],
                        () => {
                            if (editing && colId) {
                                return sendMessage<ICollection>(getCollection(colId))
                            } else {
                                return undefined
                            }
                        },
                        {
                            onSuccess: (col) => {
                                setValues((prev) => {
                                    const newValues: any = prev
                                    for (const [key, value] of Object.entries(prev)) {
                                        if (!value && col) {
                                            newValues[key] = col[key as keyof ICollection] ?? ''
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
