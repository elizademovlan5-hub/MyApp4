
import { Product } from "@/models/product.model";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: Product;
  onAdd: (item: Product) => void;
  onRemove: (id: number) => void;
};

export default function ProductCard({
  item,
  onAdd,
  onRemove,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onAdd(item)}
      >
        <Text style={styles.buttonText}>Elave et</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Text style={styles.buttonText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    margin: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
  },
  price: {
    fontSize: 15,
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
    width: "100%",
  },
  removeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 6,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
