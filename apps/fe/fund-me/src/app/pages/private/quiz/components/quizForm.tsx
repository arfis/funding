import React, {useEffect} from 'react';
import {Formik, Field, Form, FieldArray, useFormikContext} from 'formik';
import * as Yup from 'yup';
import {
    GetQuizesDocument, InvestmentType, Quiz,
    useCreateQuizMutation,
    useUpdateQuizMutation
} from '../../../../../generated/graphql';
import {
    Button, TextField, MenuItem, Container, Typography, Box, IconButton, Checkbox, FormControlLabel
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

// Validation Schema using Yup
const QuizSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Question type is required'),
    questions: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required('Question description is required'),
            answerType: Yup.string().required('Answer type is required'),
            answers: Yup.array().of(
                Yup.object().shape({
                    description: Yup.string().required('Answer description is required'),
                    isRight: Yup.boolean().required('Is this the correct answer?')
                })
            ).required('At least one answer is required')
        })
    ).required('At least one question is required')
});

const UpdateMinimalPoints = () => {
    const {values, setFieldValue} = useFormikContext<any>();
    useEffect(() => {
        setFieldValue('minimalPointsToSuccess', values.questions.length);
    }, [values.questions, setFieldValue]);

    return null;
};

const QuizForm: React.FC<{ quiz: Quiz | null, onCancel: () => void }> = ({quiz, onCancel}) => {
    const [createQuiz] = useCreateQuizMutation({refetchQueries: [{query: GetQuizesDocument}]});
    const [updateQuiz] = useUpdateQuizMutation({refetchQueries: [{query: GetQuizesDocument}]});

    const isEditing = !!quiz;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                {isEditing ? 'Edit Quiz' : 'Create a New Quiz'}
            </Typography>
            <Formik
                initialValues={{
                    description: quiz?.description || '',
                    type: quiz?.type || InvestmentType.CryptoInvestment,
                    minimalPointsToSuccess: quiz?.minimalPointsToSuccess || 0,
                    questions: quiz?.questions.map(q => ({
                        description: q.description,
                        answerType: q.answerType,
                        answers: q.answers.map(a => ({
                            description: a.description,
                            isRight: a.isRight
                        }))
                    })) || [
                        {
                            description: '',
                            answerType: 'SELECTION',
                            answers: [
                                {
                                    description: '',
                                    isRight: false
                                }
                            ]
                        }
                    ]
                }}
                enableReinitialize={true}
                validationSchema={QuizSchema}
                onSubmit={async (values, actions) => {
                    if (isEditing) {
                        await updateQuiz({
                            variables: {
                                id: quiz!.id,
                                input: values
                            }
                        });
                    } else {
                        await createQuiz({
                            variables: {
                                input: values
                            }
                        });
                    }
                    actions.setSubmitting(false);
                }}
            >
                {({values, errors, touched, isSubmitting, handleChange, handleBlur, setFieldValue, resetForm}) => (
                    <Form>
                        <UpdateMinimalPoints/>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Quiz Description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                type="number"
                                label="How many points are needed to succeed"
                                name="minimalPointsToSuccess"
                                value={values.minimalPointsToSuccess}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.minimalPointsToSuccess && Boolean(errors.minimalPointsToSuccess)}
                                helperText={touched.minimalPointsToSuccess && errors.minimalPointsToSuccess}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                select
                                label="Quiz type"
                                name="type"
                                value={values.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.type && Boolean(errors.type)}
                                helperText={touched.type && errors.type}
                            >
                                <MenuItem
                                    value={InvestmentType.CryptoInvestment}>{InvestmentType.CryptoInvestment}</MenuItem>
                                <MenuItem
                                    value={InvestmentType.ClassicInvestment}>{InvestmentType.ClassicInvestment}</MenuItem>
                            </TextField>
                        </Box>
                        <FieldArray name="questions">
                            {({insert, remove, push}) => (
                                <div>
                                    {values.questions.length > 0 && values.questions.map((question, index) => (
                                        <Box mb={3} key={index} border={1} borderRadius={4} p={2}>
                                            <TextField
                                                fullWidth
                                                label="Question Description"
                                                name={`questions.${index}.description`}
                                                value={question.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.questions?.[index]?.description && typeof errors.questions?.[index] === 'object' && Boolean((errors.questions[index] as any).description)}
                                                helperText={touched.questions?.[index]?.description && typeof errors.questions?.[index] === 'object' && (errors.questions[index] as any).description}
                                                margin="normal"
                                            />
                                            <TextField
                                                fullWidth
                                                label="Answer Type"
                                                name={`questions.${index}.answerType`}
                                                value={question.answerType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.questions?.[index]?.description && typeof errors.questions?.[index] === 'object' && Boolean((errors.questions[index] as any).answerType)}
                                                helperText={touched.questions?.[index]?.description && typeof errors.questions?.[index] === 'object' && (errors.questions[index] as any).answerType}
                                                margin="normal"
                                            />
                                            <FieldArray name={`questions.${index}.answers`}>
                                                {({insert, remove, push}) => (
                                                    <div>
                                                        {question.answers.length > 0 && question.answers.map((answer, answerIndex) => (
                                                            <Box mb={2} key={answerIndex} display="flex"
                                                                 alignItems="center">
                                                                <TextField
                                                                    label="Answer Description"
                                                                    name={`questions.${index}.answers.${answerIndex}.description`}
                                                                    value={answer.description}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    error={touched.questions?.[index]?.answers?.[answerIndex]?.description && Boolean((errors.questions?.[index] as any)?.answers?.[answerIndex]?.description)}
                                                                    helperText={touched.questions?.[index]?.answers?.[answerIndex]?.description && (errors.questions?.[index] as any)?.answers?.[answerIndex]?.description}
                                                                    margin="normal"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={answer.isRight}
                                                                            onChange={() => setFieldValue(`questions.${index}.answers.${answerIndex}.isRight`, !answer.isRight)}
                                                                            name={`questions.${index}.answers.${answerIndex}.isRight`}
                                                                        />
                                                                    }
                                                                    label="Is Right"
                                                                />
                                                            </Box>
                                                        ))}
                                                        <Box mb={2}>
                                                            <Button
                                                                type="button"
                                                                onClick={() => push({description: '', isRight: false})}
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<Add/>}
                                                            >
                                                                Add Answer
                                                            </Button>
                                                        </Box>
                                                    </div>
                                                )}
                                            </FieldArray>
                                            <Box display="flex" justifyContent="flex-end">
                                                <IconButton onClick={() => remove(index)} color="secondary">
                                                    <Remove/>
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button
                                        type="button"
                                        onClick={() => push({
                                            description: '',
                                            answerType: 'SELECTION',
                                            answers: [{description: '', isRight: false}]
                                        })}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Add/>}
                                    >
                                        Add Question
                                    </Button>
                                </div>
                            )}
                        </FieldArray>
                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {isEditing ? 'Update Quiz' : 'Submit Quiz'}
                            </Button>
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    resetForm();
                                    onCancel();
                                }
                                }
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default QuizForm;
