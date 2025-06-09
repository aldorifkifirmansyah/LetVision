import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  fetchBlogArticles,
  BlogArticle,
} from "../lib/utils/services/blogspotService";
import { decode } from "html-entities";

type RootStackParamList = {
  Artikel: undefined;
  ArtikelViewer: { url: string; title: string };
};

type ArtikelScreenProps = NativeStackScreenProps<RootStackParamList, "Artikel">;

export const ArtikelScreen: React.FC<ArtikelScreenProps> = ({ navigation }) => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await fetchBlogArticles();
      setArticles(fetchedArticles);
      setFilteredArticles(fetchedArticles); // Set filtered articles to all articles initially
    } catch (err) {
      setError("Tidak dapat memuat artikel. Silakan coba lagi nanti.");
      console.error("Error loading articles:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Filter articles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  const handleArticlePress = (article: BlogArticle) => {
    navigation.navigate("ArtikelViewer", {
      url: article.url,
      title: article.title,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  // Format tanggal publikasi artikel
  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Ekstrak ringkasan konten (tanpa HTML tags)
  // Ekstrak ringkasan menggunakan html-entities
  const extractSummary = (content: string) => {
    if (!content) return "";

    // Hapus tag HTML
    const withoutTags = content.replace(/<[^>]*>/g, " ");

    // Decode HTML entities
    const decodedText = decode(withoutTags);

    // Bersihkan whitespace
    const cleanText = decodedText.replace(/\s+/g, " ").trim();

    // Ambil 150 karakter pertama
    return cleanText.substring(0, 150) + (cleanText.length > 150 ? "..." : "");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari artikel..."
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Memuat artikel...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadArticles}>
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.articleList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
          >
            {filteredArticles.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery.trim() !== ""
                  ? "Tidak ada artikel yang sesuai dengan pencarian"
                  : "Belum ada artikel tersedia"}
              </Text>
            ) : (
              filteredArticles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={() => handleArticlePress(article)}
                >
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleDate}>
                    {formatPublishedDate(article.published)}
                  </Text>
                  <Text style={styles.articleSummary}>
                    {extractSummary(article.content)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingLeft: 16,
    // Tidak ada paddingRight
  },
  // Search styles
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    position: "relative",
    paddingRight: 16, // Perlu padding sendiri
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 36, // Tambahkan padding lebih besar di sisi kanan untuk tombol clear
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    color: "#212121",
  },
  clearButton: {
    position: "absolute",
    right: 8,
    top: 12,
    height: 26,
    width: 26,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Pastikan tombol selalu di atas input text
  },
  clearButtonText: {
    fontSize: 20,
    color: "#757575",
    fontWeight: "bold",
    lineHeight: 22,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  articleList: {
    paddingVertical: 8,
    paddingRight: 16, // Padding kanan untuk memberi jarak antara konten dan scrollbar
  },
  articleCard: {
    backgroundColor: "#F1F8E9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8BC34A",
    elevation: 2,
    // Tidak perlu marginRight
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#33691E",
    marginBottom: 8,
  },
  articleDate: {
    fontSize: 12,
    color: "#689F38",
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 14,
    color: "#212121",
    lineHeight: 20,
    textAlign: "justify",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#757575",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 40,
  },
});
