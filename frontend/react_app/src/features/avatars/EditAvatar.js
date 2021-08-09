import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

import { useUpdateAvatarMutation } from "../../api";

export function checkIfFilesAreCorrectType(file) {
  if (file) {
      return (['image/jpeg', 'image/png'].includes(file.type))
  }
}

export const EditAvatar = ({avatarId}) => {

  const [updateAvatar, { error }] = useUpdateAvatarMutation()
  
  return(
    <Formik
      validationSchema={yup.object({
        file: yup.mixed()
                  .required("Должен быть выбран файл")
                  .test(
                    'Файл должен иметь расширение .jpeg или .png',
                    'Файл должен иметь расширение .jpeg или .png',
                    checkIfFilesAreCorrectType
                  ),
      })}
      initialValues={{file: null}}
      onSubmit={(values) => {
        const avatar = new FormData();    
        avatar.append("photo", values.file);
        updateAvatar({id: avatarId, form: avatar})
                    .unwrap()
                    .catch(err => console.error("Не удалось загрузить на сервер аватар")) 
      }}
    >
      {({ 
        setFieldValue,
        handleSubmit,
        handleBlur,
        touched,
        errors}) => (
          <Form className="row justify-content-md-center" onSubmit={handleSubmit}>
              <Form.Group controlId="formFileSm">
                <Form.Control
                  name="file"
                  onChange={(event) => {
                    event.preventDefault()
                    setFieldValue("file", event.target.files[0]);
                  }}
                  onBlur={handleBlur}
                  type="file"
                  size="sm"
                  isInvalid={touched.file && !!errors.file}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.file}
                </Form.Control.Feedback>
              </Form.Group>
              <Button className="avatar-submit-button base-background-colour" size="sm" type="submit">Сохранить аватар</Button>
          </Form>)}
    </Formik>
  )
}
