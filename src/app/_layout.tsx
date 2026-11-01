
import ProductCard from "@/components/ProductCard";
import { availableProducts } from "@/data/availableProducts";
import { Product } from "@/models/product.model";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const categories = [
  "Meyveler",
  "Et mehsullari",
  "Sirniyyatlar",
  "Ickiler",
];

export default function App() {
  const [products, setProducts] =
    useState<Product[]>(availableProducts);

  const [cart, setCart] = useState<Product[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const [selectedCategory, setSelectedCategory] =
    useState("Meyveler");

  const [viewMode, setViewMode] = useState("category");

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const addProduct = () => {
    const productPrice = Number(price.replace(",", "."));

    if (
      !name.trim() ||
      !price.trim() ||
      !Number.isFinite(productPrice) ||
      productPrice <= 0
    ) {
      Alert.alert("Error", "Butun xanalari duzgun doldurun");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      price: productPrice,
      category: selectedCategory,
    };

    setProducts([newProduct, ...products]);

    Alert.alert(
      Platform.OS === "ios"
        ? "Mehsul elave olundu"
        : "Mehsul elave olundu"
    );

    setName("");
    setPrice("");
    Keyboard.dismiss();
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  const addToCart = (item: Product) => {
    setCart([...cart, item]);
    Alert.alert("Sebet", `${item.name} sebete elave olundu`);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  const filteredProducts = products.filter(
    (item) => item.category === selectedCategory
  );

  const sections = categories.map((category) => ({
    title: category,
    data: [
      products.filter((item) => item.category === category),
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: StatusBar.currentHeight || 45 },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.mainTitle}>Smart Market</Text>

        <View style={styles.cartInfo}>
          <Text style={styles.cartText}>
            Sebetde: {cart.length} mehsul / {totalPrice.toFixed()}
          </Text>
        </View>

        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              viewMode === "category" && styles.activeMode,
            ]}
            onPress={() => setViewMode("category")}
          >
            <Text style={styles.buttonText}>Kategoriya uzre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              viewMode === "all" && styles.activeMode,
            ]}
            onPress={() => setViewMode("all")}
          >
            <Text style={styles.buttonText}>Butun mehsullar</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.wrapper,
            { flexDirection: isLandscape ? "row" : "column" },
          ]}
        >
          <View
            style={[
              styles.formContainer,
              isLandscape && { flex: 1 },
            ]}
          >
            <Text style={styles.title}>Mehsul elave et</Text>

            <TextInput
              style={styles.input}
              placeholder="MMehsulun adi"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Qiymet"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              onSubmitEditing={addProduct}
            />

            <Text style={styles.smallTitle}>Kategoriya sec</Text>

            <View style={styles.categories}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category &&
                      styles.selectedButton,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.buttonText}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addProductButton}
              onPress={addProduct}
            >
              <Text style={styles.buttonText}>
                Mehsul elave et
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.title}>
              {viewMode === "category"
                ? selectedCategory
                : "Butun mehsullar"}
            </Text>

            {viewMode === "category" ? (
              <FlatList
                key={isLandscape ? "l" : "p"}
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={isLandscape ? 3 : 1}
                renderItem={({ item }) => (
                  <View style={{ flex: 1 }}>
                    <ProductCard
                      item={item}
                      onAdd={addToCart}
                      onRemove={removeProduct}
                    />
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <SectionList
                sections={sections}
                keyExtractor={(_, index) => index.toString()}
                renderSectionHeader={({ section }) => (
                  <Text style={styles.sectionTitle}>
                    {section.title}
                  </Text>
                )}
                renderItem={({ item }) => (
                  <View style={styles.productRow}>
                    {item.map((product) => (
                      <View
                        key={product.id}
                        style={{
                          width: isLandscape ? "32%" : "100%",
                        }}
                      >
                        <ProductCard
                          item={product}
                          onAdd={addToCart}
                          onRemove={removeProduct}
                        />
                      </View>
                    ))}
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  cartInfo: {
    alignItems: "center",
    padding: 12,
  },
  cartText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  modeButton: {
    flex: 1,
    backgroundColor: "#777",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeMode: {
    backgroundColor: "#4caf50",
  },
  wrapper: {
    flex: 1,
    padding: 12,
    gap: 16,
    backgroundColor: "deepskyblue",
  },
  formContainer: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 6,
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  smallTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 8,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  categoryButton: {
    backgroundColor: "#777",
    padding: 9,
    margin: 4,
    borderRadius: 6,
  },
  selectedButton: {
    backgroundColor: "#4caf50",
  },
  addProductButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    backgroundColor: "#f0f8ff",
    padding: 8,
    marginVertical: 6,
    borderRadius: 6,
  },
  productRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
});
