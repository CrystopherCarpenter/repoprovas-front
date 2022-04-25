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
    const [data, setData] = useState([]);
    const instructorsSearch = ['Pedrão', 'Dina'];
    const instructors = [
        {
            instructor: 'Pedrão',
            exams: [
                { name: 'P1', classes: ['React', 'HTML', 'JS'] },
                { name: 'P2', classes: ['React', 'CSS', 'SQL'] },
                { name: 'P3', classes: ['React', 'HTML', 'Mongo'] },
            ],
        },
        {
            instructor: 'Dina',
            exams: [
                { name: 'P1', classes: ['React', 'HTML', 'JS'] },
                { name: 'P2', classes: ['React', 'CSS', 'SQL'] },
                { name: 'P3', classes: ['React', 'HTML', 'Mongo'] },
            ],
        },
    ];
    const classesSearch = ['React', 'HTML', 'SQL', 'CSS', 'Mongo', 'JS'];
    const periodos = [
        {
            periodo: '1',
            classes: [
                { name: 'React', exams: ['P1', 'P2'] },
                { name: 'HTML', exams: ['P1', 'P2', 'P3'] },
                { name: 'JS', exams: ['P1', 'P2', 'P3', 'P4'] },
            ],
        },
        {
            periodo: '2',
            classes: [
                { name: 'React', exams: ['P1', 'P2'] },
                { name: 'CSS', exams: ['P1', 'P2', 'P3'] },
                { name: 'SQL', exams: ['P1', 'P2', 'P3', 'P4'] },
            ],
        },
        {
            periodo: '3',
            classes: [
                { name: 'React', exams: ['P1', 'P2'] },
                { name: 'Mongo', exams: ['P1', 'P2', 'P3'] },
                { name: 'HTML', exams: ['P1', 'P2', 'P3', 'P4'] },
            ],
        },
    ];
    const auth = JSON.parse(localStorage.getItem('auth') || '');
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
            setData(data);
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Ops!',
                text: 'Recarregue a página',
            });
            setData([]);
        }
    }

    const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTab(newTabValue);
    };

    function Class() {
        return (
            <>
                {periodos.map((item) => (
                    <Accordion key={item.periodo}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{item.periodo} Período</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {item.classes.map(
                                (classItem: {
                                    name: string;
                                    exams: string[];
                                }) => (
                                    <Accordion key={classItem.name}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>
                                                {classItem.name}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {classItem.exams.map(
                                                (item: string) => (
                                                    <List key={item}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={item}
                                                                secondary={
                                                                    'data (link da prova)'
                                                                }
                                                            />
                                                        </ListItem>
                                                    </List>
                                                )
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </>
        );
    }
    function Instructor() {
        return (
            <>
                {instructors.map((instructor) => (
                    <Accordion key={instructor.instructor}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{instructor.instructor}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {instructor.exams.map(
                                (exam: { name: string; classes: string[] }) => (
                                    <Accordion key={exam.name}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>{exam.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {exam.classes.map(
                                                (item: string) => (
                                                    <List key={item}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={item}
                                                                secondary={
                                                                    'data (link da prova)'
                                                                }
                                                            />
                                                        </ListItem>
                                                    </List>
                                                )
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                )
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
            {tab !== 2 && (
                <Search data={tab === 0 ? classesSearch : instructorsSearch} />
            )}
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
