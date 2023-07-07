import React, {useState, useEffect} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, TextArea, Modal} from '@app/compLibrary'
import toast from 'react-hot-toast'

import { createRecept } from '@app/api/Queries/Post';

/// styles
import styles from './UploadReceptsModal.module.scss'

type UploadProductModalProps = {
    show: boolean,
    setShow: (state: boolean) => void,
    onSuccess: () => void
}
type FormikValues = {
    recepts_object: {
        tm: string, 
        ru: string, 
        en: string
    },
    prepare_object: {
        tm: string, 
        ru: string, 
        en: string
    }
}

const UploadReceptsModal = (props: UploadProductModalProps) => {
    const {
        show, 
        setShow, 
        onSuccess
    } = props

    /// states
    const [images, setImages] = useState<any>([])
    const [localeSelected, setLocaleSelected] = useState<string>('tm')

    const formik = useFormik<FormikValues | any>({
        initialValues: {
            recepts_object: {
                tm: "",
                ru: "",
                en: ""
            },
            prepare_object: {
                tm: "",
                ru: "",
                en: ""
            }
        },
        validationSchema: Yup.object({
            recepts_object: Yup.object({
                tm: Yup.string().required(),
                ru: Yup.string().required(),
                en: Yup.string().required(),
            }),
            prepare_object: Yup.object({
                tm: Yup.string().min(10).required(),
                ru: Yup.string().min(10).required(),
                en: Yup.string().min(10).required(),
            }),
        }),
        onSubmit:  async (values: any, { resetForm }) => {
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
                const valuesToSend = {recepts: values.recepts_object, prepare: values.prepare_object}
                const res: any = await createRecept(valuesToSend, formData, config)
                if(res.status === 200){
                    setShow(false)
                    setImages([])
                    resetForm()
                    onSuccess()
                    toast.success('Recept succesfully added.')
                }

            } catch (error) {
                console.log(error)
            }
        }
    })
    const setFormikField = (fields: Array<string>, valueToSet: string | number) => {
        if(fields){
            for(let i = 0; i < fields.length; i++){
                formik.setFieldValue(fields[i], valueToSet)
            }
        }
    }


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
                        <div className={styles.fieldAndDropDown}>
                            <div className={styles.inputInner}>
                                <Input
                                    autoComplete='off'
                                    fontWeight='bold'
                                    fontSize='big'
                                    id='text'
                                    name={`recepts_object.${localeSelected}`}
                                    placeholder='Recept name'
                                    value={formik.values.recepts_object[localeSelected]}
                                    onChange={formik.handleChange}
                                    style={{ width: '100%'}}
                                />  
                            </div>
                            <select onChange={e=> setLocaleSelected(e.target.value)}>
                                <option value='tm'>tm</option>
                                <option value='ru'>ru</option>
                                <option value='en'>en</option>
                            </select>
                            <Button type='contained' rounded color='theme'
                            onClick={() => setFormikField([`recepts_object.${localeSelected}`, `prepare_object.${localeSelected}`], "")}
                            >Clear</Button>
                        </div>
                        <TextArea 
                            maxLength={9999}
                            placeholder={'Text area'}
                            name={`prepare_object.${localeSelected}`}
                            value={formik.values.prepare_object[localeSelected]}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <Button type='contained' color='grey' onClick={() => {
                    setShow(false); 
                    setImages([]);
                    setFormikField([`recepts_object.${localeSelected}`, `prepare_object.${localeSelected}`], "")
                }}>Cancel</Button>
                <Button type='contained' rounded color='theme' htmlType='submit'>Save</Button>
            </div>
        </form>
    </Modal>
    </>
  )
}

export default UploadReceptsModal