import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#282c34",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingTop: 40,
	},
	title: {
		fontSize: 24,
		color: "#ffffff",
		marginBottom: 20,
	},
	titleInput: { // Novo estilo para o título editável
		height: 40,
		borderColor: '#ffffff',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		color: "#ffffff",
		backgroundColor: "#3a3f47",
		marginBottom: 20, // Para manter o espaçamento como o title original
		width: '80%', // Manter a mesma largura que o input de stats
	},
	totalLevel: {
		fontSize: 18,
		color: "#ffffff",
		marginBottom: 20,
	},
	inputContainer: {
		marginBottom: 20,
		width: '80%',
	},
	label: {
		color: "#ffffff",
		marginBottom: 5,
	},
	input: {
		height: 40,
		borderColor: '#ffffff',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		color: "#ffffff",
		backgroundColor: "#3a3f47",
	},
	statsContainer: {
		width: '80%',
	},
	statCard: {
		backgroundColor: "#444c56",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
	},
	statInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	statName: {
		fontSize: 18,
		color: "#ffffff",
		flex: 1,
	},
	statLevel: {
		fontSize: 16,
		color: "#ffffff",
		marginHorizontal: 10,
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
        gap: 10
	},
	deleteIcon: {
		marginLeft: 10, // Adiciona espaço entre os botões
	},
});
