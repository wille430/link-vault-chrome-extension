import { useQuery } from '@tanstack/react-query'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { ChangeEvent, useMemo } from 'react'
import { BsPlus } from 'react-icons/bs'
import { useLocation, useNavigate, useParams } from 'react-router'
import { customFetcher } from '../../helpers/customFetcher'
import { ICollection } from '../../types/ICollection'
import { BackButton } from '../components/BackButton'

export type CreateLinkViewState = {
    url?: string
    title?: string
}

export const CreateLinkView = () => {
    const { colId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { url, title } = location.state as CreateLinkViewState

    const growTextArea = (e: ChangeEvent) => {
        const element = e.target as any
        element.style.height = '5px'
        element.style.height = element.scrollHeight + 2 + 'px'
    }

    const { data: collection } = useQuery(['collections', colId], () =>
        customFetcher<ICollection>(`/collections/${colId}`)
    )

    return (
        <section className='flex-grow-1 flex-column d-flex overflow-hidden'>
            <BackButton backTo={`/${colId}`} />

            <h4 className='mb-0 mt-2'>
                Add a link to <span className='text-primary'>{collection?.name ?? '---'}</span>
            </h4>

            <Formik
                initialValues={{
                    title: title ?? '',
                    url: url ?? '',
                    description: '',
                    collectionId: colId,
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)

                    await customFetcher('/links', {
                        method: 'POST',
                        body: JSON.stringify(values),
                    })

                    setSubmitting(false)
                    navigate(`/${colId}`)
                }}
                validate={(values) => {
                    // Remove line breaks because field is a textarea
                    values.url = values.url.replace(/\n/g, '')
                }}
            >
                {({ isSubmitting, handleChange }) => (
                    <Form className='d-flex flex-column flex-grow-1 justify-content-between overflow-auto'>
                        <div className='d-flex flex-column flex-grow-1 gap-2 py-2'>
                            <div className='form-group'>
                                <label htmlFor='title'>Title</label>
                                <Field
                                    className='form-control'
                                    id='title'
                                    type='text'
                                    name='title'
                                    placeholder='Give it a title'
                                />
                                <ErrorMessage name='title' />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='url'>Url</label>
                                <Field
                                    type='url'
                                    className='form-control resize-none'
                                    as='textarea'
                                    id='url'
                                    name='url'
                                    onChange={(e: ChangeEvent) => {
                                        growTextArea(e)
                                        handleChange(e)
                                    }}
                                    placeholder='The URL of the link'
                                />
                                <ErrorMessage name='url' />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='url'>Description</label>
                                <Field
                                    type='text'
                                    className='form-control resize-none'
                                    as='textarea'
                                    id='description'
                                    name='description'
                                    placeholder='Describe where the link leads to...'
                                    onChange={(e: ChangeEvent) => {
                                        growTextArea(e)
                                        handleChange(e)
                                    }}
                                />
                                <ErrorMessage name='description' />
                            </div>
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
