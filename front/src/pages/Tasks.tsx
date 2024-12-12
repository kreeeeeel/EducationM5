import React, {useState, useContext, useEffect} from 'react';
import TaskCard from '../components/task/TaskCard';
import TaskModal from '../components/task/TaskModal';
import TaskWeekCard from '../components/task/TaskWeekCard';
import TaskWeekModal from '../components/task/TaskWeekModal';
import {Task} from '../types/Task';
import {UserContext} from '../contexts/UserContext';
import {FaClipboardCheck} from 'react-icons/fa';
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import logo from '../images/task_page.png';
import {useLocation} from 'react-router-dom';
import {fetchTaskCompletion} from "../api/TaskCompletionApi.tsx";


const Tasks: React.FC = () => {
    const userContext = useContext(UserContext);
    if (!userContext) return null;

    const wallet = useTonWallet()
    const [tonConnectUI] = useTonConnectUI();
    const {tasks} = userContext;
    const [showModal, setShowModal] = useState(false);
    const [showModalWeek, setShowModalWeek] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const location = useLocation();
    const {showModalConnectWallet} = location.state || {};

    useEffect(() => {
        if (showModalConnectWallet) {
            const task = tasks?.find(it => it.type === 'CONNECT_WALLET');
            if (task) {
                handleTaskClick(task);
            }
        }

        const disconnectWallet = async () => {
            if (userContext.userInfo != null && userContext.userInfo?.details?.walletAddress == null && wallet != null) {
                await tonConnectUI.disconnect();
            }
        };

        disconnectWallet();
    }, [userContext.userInfo]);

    const handleTaskClick = (task: Task) => {
        document.body.style.overflow = 'hidden'

        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';

        setShowModal(false);
        setSelectedTask(null);
    };

    const handleWeekClick = () => {
        document.body.style.overflow = 'hidden'

        setShowModalWeek(true);
    }

    const handleWeekClose = () => {
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';

        setShowModalWeek(false)
    }

    const handleCheckMission = async () => {
        if (!selectedTask) return;

        try {
            // Обновить статус задания на выполненное
            if (selectedTask.type !== 'WALLET_TRANSACTION' && selectedTask.type !== 'CONNECT_WALLET') {
                const missionResponse = await fetchTaskCompletion(selectedTask.id);
                if (!missionResponse) {
                    alert('Задание не выполнено.');
                    return;
                }

                userContext.setTasks((prevTasks) =>
                    prevTasks!.map((task) =>
                        task.id === selectedTask.id ? {...task, isCompleted: true} : task
                    )
                );

                userContext?.setUserInfo((prev) =>
                    prev
                        ? {
                            ...prev,
                            fuel: prev.fuel + selectedTask.reward + (missionResponse.bonus ?? 0),
                            exp: missionResponse.newExp,
                            level: missionResponse.newLevel ?? prev.level,
                        }
                        : prev
                );
            }
        } catch (err) {
            alert('Задание не выполнено.');
        }
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#071333] to-[#0B1428] text-white">
            <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mt-4 mb-6 text-center">
                    <div className="flex justify-center items-center">
                        <img
                            src={logo}
                            alt={logo}/>
                    </div>

                    <div className="flex justify-center items-center">
                        <FaClipboardCheck className="mr-2 text-2xl"/>
                        <h1 className="text-2xl font-bold">Различные задания</h1>
                    </div>
                    <p className="text-sm text-gray-500">Зарабатывайте больше, выполняя задания!</p>
                </div>
                <h1 className="mt-2 mb-1 ml-2 text-2xl font-bold">Ежедневная награда</h1>
                <TaskWeekCard onClick={handleWeekClick} onClose={handleWeekClose}/>
                <h1 className="mt-2 mb-1 ml-2 text-2xl font-bold">Задания</h1>
                <div className="space-y-1">
                    {tasks?.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)}/>
                    ))}
                </div>
                {showModal && (
                    <TaskModal
                        selectedTask={selectedTask}
                        onClose={handleCloseModal}
                        onCheck={handleCheckMission}
                        isChecking={false}
                    />
                )}
                {showModalWeek && (
                    <TaskWeekModal onClose={handleWeekClose}></TaskWeekModal>
                )}
            </main>
        </div>
    );
};

export default Tasks;
