import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View, ScrollView, Alert, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importando o ícone
import { styles } from "./style";

interface StatsProps {
	id: number;
	name: string;
	level: number;
	lastUpdated: number; // Timestamp da última atualização
}

const STORAGE_KEY = '@stats';
const TITLE_KEY = '@title'; // Chave para armazenar o título

export default function App() {
	const [stats, setStats] = useState<StatsProps[]>([]);
	const [name, setName] = useState("");
	const [title, setTitle] = useState("Status do Personagem"); // Título editável
	const [isEditing, setIsEditing] = useState(false); // Estado para controle do modo de edição

	const loadStats = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
			if (jsonValue != null) {
				setStats(JSON.parse(jsonValue));
			}
		} catch (e) {
			console.error("Erro ao carregar stats:", e);
		}
	};

	const loadTitle = async () => {
		try {
			const savedTitle = await AsyncStorage.getItem(TITLE_KEY);
			if (savedTitle != null) {
				setTitle(savedTitle);
			}
		} catch (e) {
			console.error("Erro ao carregar título:", e);
		}
	};

	const saveTitle = async (newTitle: string) => {
		try {
			await AsyncStorage.setItem(TITLE_KEY, newTitle);
		} catch (e) {
			console.error("Erro ao salvar título:", e);
		}
	};

	const saveStats = async (statsToSave: StatsProps[]) => {
		try {
			const jsonValue = JSON.stringify(statsToSave);
			await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
		} catch (e) {
			console.error("Erro ao salvar stats:", e);
		}
	};

	const createStat = () => {
		const newStat = {
			id: stats.length + 1,
			name: name,
			level: 1,
			lastUpdated: Date.now(), // Salva o timestamp atual
		};
		const updatedStats = [...stats, newStat];
		setStats(updatedStats);
		saveStats(updatedStats);
		setName("");
	};

	const levelUp = (id: number) => {
		const updatedStats = stats.map(stat =>
			stat.id === id ? { ...stat, level: stat.level + 1, lastUpdated: Date.now() } : stat // Atualiza o timestamp
		);
		setStats(updatedStats);
		saveStats(updatedStats);
	};

	const levelDown = (id: number) => {
		const updatedStats = stats.map(stat =>
			stat.id === id ? { ...stat, level: stat.level - 1, lastUpdated: Date.now() } : stat // Atualiza o timestamp
		);
		setStats(updatedStats);
		saveStats(updatedStats);
	};

	const deleteStat = (id: number) => {
		const updatedStats = stats.filter(stat => stat.id !== id);
		setStats(updatedStats);
		saveStats(updatedStats);
	};

	const totalLevel = stats.reduce((acc, stat) => acc + stat.level, 0);

	const scheduleNotification = () => {
		Notifications.scheduleNotificationAsync({
			content: {
				title: "Inatividade Detectada",
				body: "Você não atualizou nenhum stat nas últimas 48 horas!",
			},
			trigger: null, // Notificação será exibida imediatamente
		});
	};

	useEffect(() => {
		loadStats();
		loadTitle(); // Carrega o título ao iniciar
	}, []);

	useEffect(() => {
		const checkInactivity = () => {
			const now = Date.now();
			const inactiveStats = stats.filter(stat => now - stat.lastUpdated > 48 * 60 * 60 * 1000);
			if (inactiveStats.length > 0) {
				scheduleNotification(); // Agenda a notificação
			}
		};

		checkInactivity();
	}, [stats]);

	const handleEditTitle = () => {
		setIsEditing(true);
	};

	const handleConfirmTitle = () => {
		saveTitle(title);
		setIsEditing(false);
	};

	return (
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={() => setIsEditing(false)}>
				<View>
					{isEditing ? (
						<View style={styles.inputContainer}>
							<TextInput 
								value={title} 
								onChangeText={setTitle} 
								style={styles.titleInput}
								autoFocus
							/>
							<Button title="OK" onPress={handleConfirmTitle} color="#4CAF50" />
						</View>
					) : (
						<Text style={styles.title} onPress={handleEditTitle}>{title}</Text>
					)}
				</View>
			</TouchableWithoutFeedback>
			<Text style={styles.totalLevel}>Nível Total: {totalLevel}</Text>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Nome do Stat</Text>
				<TextInput 
					value={name} 
					onChangeText={(text) => setName(text)} 
					style={styles.input}
				/>
				<Button title="Criar Stat" onPress={createStat} color="#4CAF50" />
			</View>
			<ScrollView style={styles.statsContainer}>
				{stats.map((stat) => (
					<View key={stat.id} style={styles.statCard}>
						<View style={styles.statInfo}>
							<Text style={styles.statName}>{stat.name}</Text>
							<Text style={styles.statLevel}>Nível: {stat.level}</Text>
							<View style={styles.buttonContainer}>
								<Button title="+" onPress={() => levelUp(stat.id)} color="#2196F3" />
								<Button title="-" onPress={() => levelDown(stat.id)} color="#F44336" />
								<Icon 
									name="delete" 
									size={24} 
									color="#FF5722" 
									onPress={() => deleteStat(stat.id)} 
									style={styles.deleteIcon}
								/>
							</View>
						</View>
					</View>
				))}
			</ScrollView>
			<StatusBar style="auto" />
		</View>
	);
}
