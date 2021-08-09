import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

import { AcademicRank } from '../../constants' 
import { signUp, login} from "./authSlice"

import { unwrapResult } from '@reduxjs/toolkit'

import { ErrorMessage } from "../general/ErrorMessage";

import { useGetRegionalBranchesQuery } from "../../api";

const password_errors_translation = new Map()
password_errors_translation.set("The password is too similar to the email address.", "Пароль слишком похож на электронную почту")

const email_errors_translation = new Map()
email_errors_translation.set('user with this email address already exists.', "Пользователь с таким электронным адресом уже существует")

const translation_dictionary = {
  email: email_errors_translation,
  password: password_errors_translation
}

function translateErrors(errors){
  let field_errors;
  const traslated_errors = {}
  for (let field in errors){
    if (field in translation_dictionary){  
      const field_errors = errors[field]
      const translated_field_errors = field_errors.map(message => 
        translation_dictionary[field].get(message)
      )
      traslated_errors[field] = translated_field_errors
    }
  }
  return traslated_errors
}

// необходимо добавить дргуие поля в translted
const SignUpForm = () => {

  const dispatch = useDispatch()

  const [isSignUpFailed, setIsSignUpFailed] = useState(false)
  
  const [signUpErrors, setSignUpErrors] = useState({})

  let {data: regionalBranches} = useGetRegionalBranchesQuery()

  if (regionalBranches){
    regionalBranches = regionalBranches.map(reg => (
        <option key={reg.id} value={reg.id}>
          {reg.title}
        </option>
      ))
  }

  const academicRanks = useSelector(state => {
    return Object.entries(AcademicRank).map(aca => (
      <option key={aca[0]} value={aca[0]}>
        {aca[1]}
      </option>
    ))
  })

  const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const schema = yup.object().shape({
    email: yup.string()
      .email("Адрес почты не валиден")
      .max(100, "Электронная почта должна иметь меньше 100 букв")
      .required("Электронная почта обязательна"),
    first_name: yup.string()
      .required("Имя обязательно")
      .min(2, "Имя должно иметь больше двух букв")
      .max(100, "Имя должно иметь меньше 100 букв"),
    last_name: yup.string()
      .required("Фамилия обязательна")
      .min(2, "Фамилия должна иметь больше двух букв")
      .max(100, "Фамилия должна иметь меньше 100 букв"),
    patronymic: yup.string()
      .min(2, "Отчество должна иметь больше двух букв")
      .max(100, "Отчество должна иметь меньше 100 букв"),
    phone_number: yup.string()
      .matches(phoneRegExp, "Номер телефона не валиден")
      .required("Номер телефона обязателен"),
    regional_branch: yup.string()
      .required("Региональный отделение обязателено"),
    academic_rank: yup.string()
      .required("Академическое звание обязателено"),
    password: yup.string()
      .min(8, "Пароль должен быть длиннее 8 знаков")
      .required("Пароль обязателен"),
    re_password: yup.string()
      .required("Подтверждение пароля обязателено")
      .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
  });

  return (
    <React.Fragment>
      <ErrorMessage isFailed={isSignUpFailed} message={Object.values(signUpErrors)}/>
      <Formik
        validationSchema={schema}
        onSubmit = {async (values, {setSubmitting}) => {
          if (process.env.NODE_ENV === 'development') 
          {
            alert(JSON.stringify(values, null, 2));
          }
          setSubmitting(true);
          
          const result = await dispatch(signUp(values))
          try {
            unwrapResult(result)
            setIsSignUpFailed(false)
            setSignUpErrors({email: [], password: []})
            await dispatch(login({email: values.email, password: values.password}))
          }
          catch (err) {
            console.error("Signup failed", err);
            const translated_errors = translateErrors(err)
            setSignUpErrors(translated_errors)
            setIsSignUpFailed(true)
          }
          setSubmitting(false);
        }}
        initialValues={{
          email: "",
          first_name: "",
          last_name: "",
          patronymic: "",
          phone_number: "",
          regional_branch: "",
          academic_rank: "",
          password: "",
          re_password: "",
        }}
      >
        {({handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="validationFormik00">
              <Form.Label>Электронная почта</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="example@gmail.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && !!errors.email}
                isValid={touched.email &&!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationFormik02">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                    isValid={touched.password && !errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik02">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="re_password"
                    placeholder="Подтверждение пароля"
                    value={values.re_password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.re_password && !!errors.re_password}
                    isValid={touched.re_password && !errors.re_password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.re_password}
                  </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormik02">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder="Менделеев"
                    value={values.last_name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.last_name && !!errors.last_name}
                    isValid={touched.last_name && !errors.last_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik01">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="Дмитрий"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.first_name && !errors.first_name}
                    isInvalid={touched.first_name && !!errors.first_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik02">
                <Form.Label>Отчество</Form.Label>
                <Form.Control
                  type="text"
                  name="patronymic"
                  placeholder="Иванович"
                  value={values.patronymic}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.patronymic && !!errors.patronymic}
                  isValid={touched.patronymic && !errors.patronymic}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.patronymic}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="mb-2" controlId="validationFormik02">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  placeholder="89102452356"
                  value={values.phone_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.phone_number && !!errors.phone_number}
                  isValid={touched.phone_number && !errors.phone_number}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone_number}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Label>Академическое звание</Form.Label>
            <Form.Select
              className="me-sm-2"
              name="academic_rank"
              value={values.academic_rank}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={touched.academic_rank && !!errors.academic_rank}
              isValid={touched.academic_rank && !errors.academic_rank}
            >
              <option value=""></option>
              {academicRanks}
            </Form.Select>
            
            <Form.Label>Региональное отделение</Form.Label>
            <Form.Select
              className="mb-3"
              name="regional_branch"
              value={values.regional_branch}
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={touched.regional_branch && !!errors.regional_branch}
              isValid={touched.regional_branch && !errors.regional_branch}
            >
              <option value=""></option>
              {regionalBranches}
            </Form.Select>
            
            <Button className="base-background-colour" disabled={isSubmitting} type="submit">Далее</Button>
          </Form>
          
        )}
      </Formik>
    </React.Fragment>
  );
}

export default SignUpForm