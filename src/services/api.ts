import axios from 'axios';

const baseAPI = axios.create({
    baseURL: 'http://localhost:5000/',
});

interface UserData {
    email: string;
    password: string;
}

function getConfig(token: string) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

async function signUp(signUpData: UserData) {
    await baseAPI.post('/sign-up', signUpData);
}

async function signIn(signInData: UserData) {
    return baseAPI.post<{ token: string }>('/sign-in', signInData);
}

export interface Term {
    id: number;
    number: number;
}

export interface Discipline {
    id: number;
    name: string;
    teacherDisciplines: TeacherDisciplines[];
    term: Term;
}

export interface TeacherDisciplines {
    id: number;
    discipline: Discipline;
    teacher: Teacher;
    tests: Test[];
}

export interface Teacher {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Test {
    id: number;
    name: string;
    pdfUrl: string;
    views?: number;
    category: Category;
}

export interface TestData {
    name: string;
    pdfUrl: string;
    categoryId: number | null;
    teacherDisciplineId: number | null;
}

export type TestByDiscipline = Term & {
    disciplines: Discipline[];
};

export type TestByTeacher = TeacherDisciplines & {
    teacher: Teacher;
    disciplines: Discipline[];
    tests: Test[];
};

async function getTestsByDiscipline(token: string) {
    const config = getConfig(token);
    return baseAPI.get<{ tests: TestByDiscipline[] }>(
        '/tests?groupBy=disciplines',
        config
    );
}

async function getTestsByTeacher(token: string) {
    const config = getConfig(token);
    return baseAPI.get<{ tests: TestByTeacher[] }>(
        '/tests?groupBy=teachers',
        config
    );
}

async function getCategories(token: string) {
    const config = getConfig(token);
    return baseAPI.get<{ categories: Category[] }>('/categories', config);
}

async function postTest(testData: TestData, token: string) {
    const config = getConfig(token);
    return baseAPI.post('/tests', testData, config);
}

async function updateViews(testId: number) {
    return baseAPI.put(`/tests/${testId}`);
}

const api = {
    signUp,
    signIn,
    getTestsByDiscipline,
    getTestsByTeacher,
    getCategories,
    postTest,
    updateViews,
};

export default api;
