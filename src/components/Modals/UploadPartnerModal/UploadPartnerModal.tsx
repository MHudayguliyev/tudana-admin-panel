import React, {useState} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Modal } from '@app/compLibrary';

// styles
import styles from './UploadPartnerModal.module.scss'

///react hot toast
import toast from 'react-hot-toast';
import { createPartner } from '@app/api/Queries/Post';


type UploadPartnerModalProps = {
  show: boolean,
  setShow: (state: boolean) => void,
  onSuccess: () => void
}

type FormikValues = {
  partner: string
}


const UploadPartnerModal = (props: UploadPartnerModalProps) => {
  const {
    show, 
    setShow,
    onSuccess
  } = props

  const [images, setImages] = useState<any>([])



  const formik = useFormik<FormikValues>({
    initialValues: {
        partner: ''
    },
    validationSchema: Yup.object({
        partner: Yup.string().required(),
    }),
    onSubmit:  async (values: any, { resetForm }) => {
        console.log(values)
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
            const res: any = await createPartner(values, formData, config)
            console.log('response', res)

            if(res.status === 200){
                setShow(false)
                setImages([])
                resetForm()
                onSuccess()
                toast.success('Partner succesfully added.')
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
        close={setShow}
      >
        <form onSubmit={formik.handleSubmit} className={styles.theForm}>
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
                                name='partner'
                                placeholder='Partner name'
                                value={formik.values.partner}
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
                  formik.setFieldValue('partner', "")
                }}>Cancel</Button>
                <Button type='contained' color='theme' htmlType='submit'>Save</Button>
            </div>
        </form>
      </Modal>
    </>
  )
}

export default UploadPartnerModal