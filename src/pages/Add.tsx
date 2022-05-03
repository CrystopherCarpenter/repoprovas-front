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

interface Categories {
    [propName: string]: number;
}

function Add() {
    const { token }: any = useAuth();
    const [teacherByDiscipline, setTeacherByDiscipline] =
        useState<TeacherByDiscipline>({});
    const [categories, setCategories] = useState<Categories>({});
    const { setMessage } = useAlert();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');
    const teachers: string[] = selectedDiscipline
        ? Object.keys(teacherByDiscipline[selectedDiscipline])
        : [];
    const [formData, setFormData] = useState<TestData>({
        name: '',
        pdfUrl: '',
        categoryId: null,
        teacherDisciplineId: null,
    });

    useEffect(() => {
        async function loadPage() {
            if (!token) return;

            const { data } = await api.getTestsByTeacher(token);
            const testsData: any = teachersDisciplinesSort(data.tests);
            setTeacherByDiscipline(testsData);
            const { data: categoriesData } = await api.getCategories(token);
            const categories: Categories = {};
            categoriesData.categories.forEach(
                (category) => (categories[category.name] = category.id)
            );

            setCategories(categories);
        }
        loadPage();
    }, [token]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleTeacherDisciplineId(value: string) {
        setFormData({
            ...formData,
            teacherDisciplineId: teacherByDiscipline[selectedDiscipline][value],
        });
    }

    function handleCategoryId(value: string) {
        setFormData({
            ...formData,
            categoryId: categories[value],
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (
            !formData?.name ||
            !formData?.pdfUrl ||
            !formData?.categoryId ||
            !selectedDiscipline ||
            !selectedTeacher
        ) {
            setMessage({
                type: 'error',
                text: 'Todos os campos são obrigatórios!',
            });
            return;
        }

        try {
            await api.postTest(formData, token);
            setFormData({
                name: '',
                pdfUrl: '',
                categoryId: null,
                teacherDisciplineId: null,
            });
            setSelectedCategory('');
            setSelectedDiscipline('');
            setSelectedTeacher('');
            setMessage({
                type: 'success',
                text: 'Prova adicionada com sucesso!',
            });
        } catch (error: any) {
            if (error.response) {
                setMessage({
                    type: 'error',
                    text: 'Erro, verifique os dados e tente novamente',
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
                        name="name"
                        sx={styles.input}
                        label="Título da prova"
                        type="text"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.name}
                    />
                    <TextField
                        name="pdfUrl"
                        sx={styles.input}
                        label="PDF da prova"
                        type="text"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.pdfUrl}
                    />
                    <Autocomplete
                        id="categoryId"
                        sx={styles.input}
                        options={Object.keys(categories)}
                        value={selectedCategory}
                        onChange={(event: any, newValue: any) => {
                            setSelectedCategory(newValue);
                            handleCategoryId(newValue);
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
                        value={selectedDiscipline}
                        onChange={(event: any, newValue: any) => {
                            setSelectedDiscipline(newValue);
                            setSelectedTeacher('');
                        }}
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
                        value={selectedTeacher}
                        onChange={(event: any, newValue: any) => {
                            setSelectedTeacher(newValue);
                            handleTeacherDisciplineId(newValue);
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
        if (!teacherByDiscipline[discipline]) {
            teacherByDiscipline[discipline] = { [teacher]: item.id };
        }
        teacherByDiscipline[discipline][teacher] = item.id;
    });

    return teacherByDiscipline;
}
export default Add;
