import React, {useState} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Modal} from '@app/compLibrary'
import toast from 'react-hot-toast'
import { createWhouse } from '@app/api/Queries/Post';

/// styles 
import styles from './UploadWhouse.module.scss'

type UploadWhouseModalProps = {
    show: boolean,
    setShow: (state: boolean) => void,
    onSuccess: () => void
}
type FormikValues = {
    whouse: string
}

const UploadWhouse = (props: UploadWhouseModalProps) => {
    const {
        show,
        setShow,
        onSuccess
    } = props

    /// states
    const [images, setImages] = useState<any>([])
    const formik = useFormik<FormikValues>({
        initialValues: {
            whouse: '',
        },
        validationSchema: Yup.object({
            whouse: Yup.string().required()
        }),
        onSubmit:  async (values: any, { resetForm }: {resetForm: any}) => {
            try {
                if(!images.length) {
                    return toast.error('Please select at least one image')
                }

                const formData = new FormData()
                for(let i = 0; i < images.length; i++){
                    formData.append('attachments', images[i])
                }
                const config = {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    }
                }
                const res: any = await createWhouse(values, formData, config)
                console.log('response', res)
                if(res.status === 200){
                    setShow(false)
                    setImages([])
                    resetForm()
                    onSuccess()
                    toast.success(res.message)
                }

            } catch (error) {
                console.log(error)
            }
        }
    })

  return (
    <>
    <Modal
        style={{width: '30rem'}}
        isOpen={show}
        close={() => setShow(false)}
    >
         <form className={styles.theForm} onSubmit={formik.handleSubmit}>
            <div className={styles.modalBody}>
                <div className={styles.formInputs}>
                    <div className={styles.upload_part}>
                        <label htmlFor='file' className={styles.upload_btn}>
                          <i className='bx bxs-cloud-upload'></i>
                          <p>Select a file</p>
                        </label>
                        <Input
                            id='file'
                            type='file'
                            name='image'
                            onChange={(e: any) => setImages([...images, e.target.files[0]])}
                            onClick={(e: any) => e.target.value = ''}
                            className={styles.form_input}
                        />
                       
                    </div>
                    <div className={styles.selected_image_name}>
                        {images.length > 0 && images.map((item: any, index: number) => (
                        <span key={index} className={styles.image__span}>
                            <>{item?.name}</>
                            <i className='bx bx-trash' style={{fontSize: '22px', color: 'red', cursor: 'pointer'}} onClick={() => setImages(images.filter((image: any) => image.lastModified !== item.lastModified))}></i>
                        </span>
                        ))}
                    </div>
                    <div className={styles.the_rest}>
                        <div className={styles.inputInner}>
                            <Input
                                autoComplete='off'
                                fontWeight='bold'
                                fontSize='big'
                                id='text'
                                name='whouse'
                                placeholder='Warehouse name'
                                value={formik.values.whouse}
                                onChange={formik.handleChange}
                                style={{ width: '100%'}}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <Button type='contained' color='grey' onClick={() => {setShow(false); setImages([]), formik.setFieldValue('whouse', "")}}>Cancel</Button>
                <Button type='contained' color='theme' rounded htmlType='submit'>Save</Button>
            </div>
        </form>
    </Modal>
    </>
  )
}

export default UploadWhouse