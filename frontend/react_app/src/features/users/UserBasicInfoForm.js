import React from 'react'
import { useSelector } from 'react-redux'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col } from "react-bootstrap";
import { useFormik } from "formik";

import * as yup from "yup";

import { AcademicRank, StatusCode } from '../../constants' 
import { useUpdateUserMutation } from "../../api";

import { mutateAttentively } from "../../utils";
import { ProffInterestsToUser } from "./ProffInterestsToUser";
import { AcademicTitlesToUser } from "./AcademicTitlesToUser";
import { useGetRegionalBranchesQuery } from "../../api";


export const UserBasicInfoForm = ({user}) => {
  
  const [updateUser, { isLoading: isUpdating, error }] = useUpdateUserMutation()

  let {data: regionalBranches} = useGetRegionalBranchesQuery()

  if (regionalBranches) {
    regionalBranches = regionalBranches.map(reg => {
      const IsSelected = user.regional_branch === reg.id ? true : false
      return( 
        <option key={reg.id} value={reg.id} selected={IsSelected}>
          {reg.title}
        </option>
      )
    })
  }

  const academicRanks = useSelector(state => {
    return Object.entries(AcademicRank).map(aca => {
      const IsSelected = user.academic_rank === aca[0] ? true : false
      return(
        <option key={aca[0]} value={aca[0]} selected={IsSelected}>
          {aca[1]}
        </option>
      )  
    })
  })
  
  const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  const schema = yup.object().shape({
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
  });


  const formik = useFormik({
    validationSchema: schema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true);
      mutateAttentively(() => updateUser({id: user.id, ...values}), "user")
      setSubmitting(false);
    },
    initialValues:{
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic: user.patronymic,
      phone_number: user.phone_number,
      regional_branch: user.regional_branch,
      academic_rank: user.academic_rank,
    }
  });
  return(      
  <React.Fragment>
    <Form.Group className="mb-2" controlId="validationFormik00">
      <Form.Label>Электронная почта</Form.Label>
      <Form.Control
        type="text"
        name="email"
        value={user.email}
        disabled={true}
      />
    </Form.Group>
    <Row className="mb-3">
      <Form.Group as={Col} md="4" controlId="validationFormik02">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            placeholder="Менделеев"
            value={formik.values.last_name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isInvalid={formik.touched.last_name && !!formik.errors.last_name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.last_name}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationFormik01">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            placeholder="Дмитрий"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.first_name && !! formik.errors.first_name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.first_name}
          </Form.Control.Feedback>
        </Form.Group>
      <Form.Group as={Col} md="4" controlId="validationFormik02">
        <Form.Label>Отчество</Form.Label>
        <Form.Control
          type="text"
          name="patronymic"
          placeholder="Иванович"
          value={formik.values.patronymic}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          isInvalid={formik.touched.patronymic && !!formik.errors.patronymic}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.patronymic}
        </Form.Control.Feedback>
      </Form.Group>
    </Row>
    <Form.Group className="mb-2" controlId="validationFormik02">
        <Form.Label>Телефон</Form.Label>
        <Form.Control
          type="text"
          name="phone_number"
          placeholder="89102452356"
          value={formik.values.phone_number}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          isInvalid={formik.touched.phone_number && !!formik.errors.phone_number}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.phone_number}
        </Form.Control.Feedback>
    </Form.Group>
    <Row>
      <Form.Group as={Col} md="6" controlId="validationFormik02">
        <Form.Label>Академическое звание</Form.Label>
        <Form.Select
          className="me-sm-2"
          name="academic_rank"
          value={formik.values.academic_rank}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          isInvalid={formik.touched.academic_rank && !!formik.errors.academic_rank}
        >
          {academicRanks}
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} md="6" controlId="validationFormik02">
        <Form.Label>Региональное отделение</Form.Label>
        <Form.Select
          className="mb-3"
          name="regional_branch"
          value={formik.values.regional_branch}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          isInvalid={formik.touched.regional_branch && !!formik.errors.regional_branch}
        >
          {regionalBranches}
        </Form.Select>
      </Form.Group>
    </Row>

    <ProffInterestsToUser userId={user.id}/>
    <AcademicTitlesToUser userId={user.id}/>

    <Form.Group as={Col} md="6" controlId="validationFormik02">
      <Form.Label>Статус аккаунта</Form.Label>
      <Form.Control
        type="text"
        className="mb-3"
        value={StatusCode[user.status]}
        disabled
      />
    </Form.Group>
    <Button className="base-background-colour" onClick={formik.handleSubmit} type="submit">Сохранить</Button>
  </React.Fragment>
  );
}