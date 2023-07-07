import React, {useState, useEffect} from 'react'
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import { Button, Input, Modal, Paper, SizedBox } from '@app/compLibrary'
import toast from 'react-hot-toast'

/// styles 
import styles from './UploadProductModal.module.scss'
import { createProduct } from '@app/api/Queries/Post';
import { getUnits } from '@app/api/Queries/Getters';

type UploadProductModalProps = {
    product_type: 'bouquets' | 'recepts',
    show: boolean,
    setShow: (state: boolean) => void,
    onSuccess: () => void
}
type FormikValues = {
    unit: string,
    code: string | number | undefined,
    description: string
}

const UploadProductModal = (props: UploadProductModalProps) => {
    const {
        product_type,
        show, 
        setShow,
        onSuccess
    } = props

    /// states
    const [images, setImages] = useState<any>([])

    /// queries
    const {
        data: unitsData,
        refetch
    } = useQuery("getUnits", () => getUnits(), {
        refetchOnWindowFocus: false
    })

    const formik = useFormik<FormikValues>({
        initialValues: {
            unit: unitsData ? unitsData[0].unit_name : "",
            code: '',
            description: ''
        },
        validationSchema: Yup.object({
            unit: Yup.string(),
            code: Yup.string().required('Fill the units!'),
            description: Yup.string().nullable()
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
                interface dataType<N> {
                    unit_guid: N,
                    code: N, 
                    description: N, 
                }
                const data: dataType<string> = {
                    unit_guid: values.unit,
                    code: values.code,
                    description: values.description
                }
                const res: any = await createProduct(data, formData, config)
                console.log('response', res)
                if(res.status === 200){
                    setShow(false)
                    setImages([])
                    resetForm()
                    onSuccess()
                    toast.success('Product succesfully added.')
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
                        <select name='unit'defaultValue={unitsData ? unitsData[0].unit_name : ""} onChange={formik.handleChange} className={styles.select__units}>
                            {unitsData && unitsData?.map((item: any, index: number) => (
                                <option key={index} value={item.unit_guid}>{item.unit_name}</option>
                            ))}
                        </select>
                        <div className={styles.inputInner}>
                            <Input
                                autoComplete='off'
                                fontWeight='bold'
                                fontSize='big'
                                id='text'
                                name='code'
                                placeholder='Product code'
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                style={{ width: '100%'}}
                            />
                        </div>
                        <div className={styles.inputInner}>
                            <Input
                                autoComplete='off'
                                fontWeight='bold'
                                fontSize='big'
                                id='text'
                                name='description'
                                placeholder='Product description'
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                style={{ width: '100%'}}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <Button type='contained' color='grey' onClick={() => {
                    setShow(false); 
                    setImages([]);
                    setFormikField(['code', 'description'], "")
                }}>Cancel</Button>
                <Button type='contained' color='theme' rounded htmlType='submit'>Save</Button>
            </div>
        </form>
    </Modal>
    </>
  )
}

export default UploadProductModal