import React, { useEffect, useState } from "react";
import {
    collection,
    onSnapshot
} from "firebase/firestore";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { db } from "../../firebase";

function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
            const productList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
        });
        return () => unsubscribe();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery) ||
        product.category?.toLowerCase().includes(searchQuery)
    );

    const handleCardClick = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <Typography variant="h4" gutterBottom>
                All Products
            </Typography>

            <TextField
                variant="outlined"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                sx={{ mb: 4 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Card
                            onClick={() => handleCardClick(product)}
                            sx={{ height: "100%", cursor: "pointer", display: "flex", flexDirection: "column" }}
                        >
                            {product.thumbnail && (
                                <CardMedia
                                    component="img"
                                    image={product.thumbnail}
                                    alt={product.name}
                                    height="180"
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" gutterBottom noWrap>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {product.category}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {product.discountPrice ? (
                                        <>
                                            <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                                                ${product.price}
                                            </span>
                                            <strong>${product.discountPrice}</strong>
                                        </>
                                    ) : (
                                        <strong>${product.price}</strong>
                                    )}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {filteredProducts.length === 0 && (
                    <Typography variant="body1" align="center" width="100%">
                        No products found.
                    </Typography>
                )}
            </Grid>

            {/* Product Detail Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                {selectedProduct && (
                    <>
                        <DialogTitle>{selectedProduct.name}</DialogTitle>
                        <DialogContent>
                            {selectedProduct.thumbnail && (
                                <Box
                                    component="img"
                                    src={selectedProduct.thumbnail}
                                    alt={selectedProduct.name}
                                    sx={{ width: "100%", borderRadius: 2, mb: 2 }}
                                />
                            )}
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Category: {selectedProduct.category}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {selectedProduct.description || "No description provided."}
                            </Typography>
                            <Typography variant="h6">
                                Price:{" "}
                                {selectedProduct.discountPrice ? (
                                    <>
                                        <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                                            ${selectedProduct.price}
                                        </span>
                                        <strong>${selectedProduct.discountPrice}</strong>
                                    </>
                                ) : (
                                    <strong>${selectedProduct.price}</strong>
                                )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Stock: {selectedProduct.stock ?? "N/A"}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Close</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleCloseModal();
                                    window.location.href = `/products/${selectedProduct.id}`;
                                }}
                            >
                                View Full Page
                            </Button>
                            {/* Future: Add to Cart Button */}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </DashboardLayout>
    );
}

export default ProductCatalog;
