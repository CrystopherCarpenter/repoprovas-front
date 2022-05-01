import {
    Autocomplete,
    Box,
    Button,
    Divider,
    TextField,
    Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api, { TestByTeacher, TestData } from '../services/api';

import Form from '../components/Form';
import useAlert from '../hooks/useAlert';

const styles = {
    input: { marginBottom: '28px', height: '56px', width: '100%' },
};

function Add() {
    const { token }: any = useAuth();
    const [teacherByDiscipline, setTeacherByDiscipline] =
        useState<TeacherByDiscipline>({});
    const [categories, setCategories] = useState<string[]>([]);
    const { setMessage } = useAlert();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TestData>({
        title: '',
        testPDF: '',
        category: '',
        discipline: '',
        teacher: '',
    });
    const teachers: string[] = formData.discipline
        ? teacherByDiscipline[formData.discipline]
        : [];

    useEffect(() => {
        async function loadPage() {
            if (!token) return;

            const { data } = await api.getTestsByTeacher(token);
            const testsData: any = teachersDisciplinesSort(data.tests);
            setTeacherByDiscipline(testsData);
            const { data: categoriesData } = await api.getCategories(token);
            setCategories(
                categoriesData.categories.map((category) => category.name)
            );
        }
        loadPage();
    }, [token]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (!formData?.title || !formData?.testPDF || !formData?.category) {
            setMessage({
                type: 'error',
                text: 'Todos os campos são obrigatórios!',
            });
            return;
        }

        try {
            await api.postTest(formData, token);
            setMessage({
                type: 'success',
                text: 'Prova adicionada com sucesso!',
            });
        } catch (error: Error | AxiosError | any) {
            if (error.response) {
                setMessage({
                    type: 'error',
                    text: error.response.data,
                });
                return;
            }

            setMessage({
                type: 'error',
                text: 'Erro, tente novamente em alguns segundos!',
            });
        }
    }

    return (
        <>
            <Typography
                sx={{ marginX: 'auto', marginBottom: '25px', fontSize: '24px' }}
            >
                Adicione uma prova
            </Typography>
            <Divider sx={{ marginBottom: '35px' }} />
            <Box
                sx={{
                    marginX: 'auto',
                    width: '700px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/app/disciplinas')}
                    >
                        Disciplinas
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/app/pessoas-instrutoras')}
                    >
                        Pessoa Instrutora
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/app/adicionar')}
                    >
                        Adicionar
                    </Button>
                </Box>
                <Form onSubmit={handleSubmit}>
                    <TextField
                        name="title"
                        sx={styles.input}
                        label="Título da prova"
                        type="text"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.title}
                    />
                    <TextField
                        name="testPDF"
                        sx={styles.input}
                        label="PDF da prova"
                        type="text"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.testPDF}
                    />
                    <Autocomplete
                        id="category"
                        sx={styles.input}
                        options={categories}
                        value={formData.category}
                        onChange={(event: any, newValue: string | null) => {
                            setFormData({ ...formData, category: newValue });
                        }}
                        isOptionEqualToValue={(
                            option: string,
                            value: string
                        ) => {
                            return option === value || value === '';
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Categoria" />
                        )}
                    />
                    <Autocomplete
                        id="discipline"
                        options={Object.keys(teacherByDiscipline)}
                        sx={styles.input}
                        value={formData.discipline}
                        onChange={(event: any, newValue: any) =>
                            setFormData({
                                ...formData,
                                teacher: '',
                                discipline: newValue,
                            })
                        }
                        isOptionEqualToValue={(
                            option: string,
                            value: string
                        ) => {
                            return option === value || value === '' || !option;
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Disciplina" />
                        )}
                    />
                    <Autocomplete
                        id="teacher"
                        options={teachers}
                        value={formData.teacher}
                        onChange={(event: any, newValue: string | null) => {
                            setFormData({
                                ...formData,
                                teacher: newValue,
                            });
                        }}
                        sx={styles.input}
                        isOptionEqualToValue={(
                            option: string,
                            value: string
                        ) => {
                            return option === value || value === '';
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Pessoa instrutora" />
                        )}
                    />
                    <Button
                        sx={{ ...styles.input, height: '46px' }}
                        variant="contained"
                        type="submit"
                    >
                        Enviar
                    </Button>
                </Form>
            </Box>
        </>
    );
}

interface TeacherByDiscipline {
    [propName: string]: any;
}

function teachersDisciplinesSort(data: TestByTeacher[]) {
    const teacherByDiscipline: TeacherByDiscipline = {};
    data.forEach((item: any) => {
        const discipline: string = item.discipline.name;
        const teacher: string = item.teacher.name;
        if (teacherByDiscipline[discipline]) {
            teacherByDiscipline[discipline].push(teacher);
        } else {
            teacherByDiscipline[discipline] = [teacher];
        }
    });
    return teacherByDiscipline;
}
export default Add;
