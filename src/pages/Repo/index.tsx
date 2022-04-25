import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import {
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Repo() {
    const [tab, setTab] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [dataByTeacher, setDataByTeacher] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [dataByTerm, setDataByTerm] = useState([]);
    // @ts-ignore
    const auth = JSON.parse(localStorage.getItem('auth'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth || auth === '') {
            Swal.fire({
                text: 'Please login to continue',
            });
            navigate('/');
        } else {
            authValidation();
        }
    }, []);

    async function authValidation() {
        try {
            await api.authToken(auth);
            loadData();
        } catch {
            Swal.fire({
                text: 'Faça login para continuar',
            });
            navigate('/');
        }
    }

    async function loadData() {
        try {
            const { data } = await api.getData(auth);
            setTeachers(data.teachers);
            setDisciplines(data.disciplines);
            setDataByTeacher(data.dataByTeacher);
            setDataByTerm(data.dataByTerm);
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Ops!',
                text: 'Recarregue a página',
            });
        }
    }

    const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTab(newTabValue);
    };

    function Class() {
        return (
            <>
                {dataByTerm?.map(
                    (term: {
                        disciplines: any[];
                        id: number;
                        number: number;
                    }) => (
                        <Accordion key={term.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{term.number} Período</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {term.disciplines.map(
                                    (discipline: {
                                        name: string;
                                        teacherDisciplines: any[];
                                    }) => (
                                        <Accordion key={discipline.name}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography>
                                                    {discipline.name}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {discipline.teacherDisciplines.map(
                                                    (item: any) =>
                                                        item.tests.map(
                                                            (test: any) => (
                                                                <List
                                                                    key={
                                                                        test.id
                                                                    }
                                                                >
                                                                    <ListItem>
                                                                        <ListItemText
                                                                            primary={
                                                                                test.category
                                                                            }
                                                                            secondary={
                                                                                <a
                                                                                    href={
                                                                                        test.pdfUrl
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        test.name
                                                                                    }{' '}
                                                                                    {
                                                                                        '('
                                                                                    }
                                                                                    {
                                                                                        item
                                                                                            .teacher
                                                                                            .name
                                                                                    }
                                                                                    {
                                                                                        ')'
                                                                                    }
                                                                                </a>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                </List>
                                                            )
                                                        )
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                )}
                            </AccordionDetails>
                        </Accordion>
                    )
                )}
            </>
        );
    }
    function Instructor() {
        return (
            <>
                {dataByTeacher?.map((teacher: any) => (
                    <Accordion key={teacher.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{teacher.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {teacher.teacherDisciplines.map((item: any) =>
                                item.tests.map((test: any) => (
                                    <Accordion key={test.id}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>{test.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List key={test.categorie.name}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={
                                                            test.categorie.name
                                                        }
                                                        secondary={
                                                            <a
                                                                href={
                                                                    test.pdfUrl
                                                                }
                                                            >
                                                                {test.name}{' '}
                                                                {
                                                                    item
                                                                        .discipline
                                                                        .name
                                                                }
                                                            </a>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </>
        );
    }
    function Search(params: { data: string[] }) {
        const options = [...params.data];
        const [value, setValue] = useState<string | null>('');
        const [inputValue, setInputValue] = useState('');

        return (
            <Autocomplete
                value={value}
                onChange={(
                    event: React.SyntheticEvent<Element, Event>,
                    newValue: string | null
                ) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(
                    event: React.SyntheticEvent<Element, Event>,
                    newInputValue
                ) => {
                    setInputValue(newInputValue);
                }}
                options={options}
                sx={{
                    width: '450px',
                    margin: '25px auto',
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={tab === 0 ? 'Disciplinas' : 'Pessoa instrutora'}
                    />
                )}
                isOptionEqualToValue={(option: string, value: string) => {
                    return option === value || value === '';
                }}
            />
        );
    }

    return (
        <Container
            sx={{
                paddingTop: '180px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {tab !== 2 && <Search data={tab === 0 ? disciplines : teachers} />}
            <Divider sx={{ width: '100vw' }} />
            <Box
                sx={{
                    width: '100%',
                    paddingTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Tabs
                    onChange={handleChange}
                    value={tab}
                    aria-label="Tabs where selection follows focus"
                    selectionFollowsFocus
                >
                    <Tab sx={{ margin: 'auto 60px' }} label="DISCIPLINAS" />
                    <Tab
                        sx={{ margin: 'auto 60px' }}
                        label="PESSOA INSTRUTORA"
                    />
                    <Tab sx={{ margin: 'auto 60px' }} label="ADICIONAR" />
                </Tabs>
            </Box>
            {tab === 0 ? <Class /> : tab === 1 ? <Instructor /> : <></>}
        </Container>
    );
}

export default Repo;
