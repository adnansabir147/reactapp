import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { Card, Typography, Grid, Chip } from "@mui/material";

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "Products", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.error("No such product!");
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <Typography variant="h6" sx={{ m: 4 }}>Loading product...</Typography>;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={10} lg={8}>
                        <Card sx={{ p: 4 }}>
                            <Typography variant="h4" gutterBottom>
                                {product.name}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    {product.thumbnail && (
                                        <img
                                            src={product.thumbnail}
                                            alt="Thumbnail"
                                            style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }}
                                        />
                                    )}
                                    {product.images?.length > 0 && (
                                        <Grid container spacing={1} mt={1}>
                                            {product.images.map((img, idx) => (
                                                <Grid item key={idx}>
                                                    <img
                                                        src={img}
                                                        alt={`img-${idx}`}
                                                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" paragraph>
                                        <strong>Description:</strong> {product.description || "N/A"}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Price:</strong> ${product.price}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Discount Price:</strong> ${product.discountPrice || "-"}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Stock:</strong> {product.stock}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>Category:</strong> {product.category || "-"}
                                    </Typography>
                                    {product.tags?.length > 0 && (
                                        <Typography variant="body1" paragraph>
                                            <strong>Tags:</strong>{" "}
                                            {product.tags.map((tag, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={tag}
                                                    size="small"
                                                    sx={{ m: 0.5 }}
                                                />
                                            ))}
                                        </Typography>
                                    )}
                                    {product.createdAt && (
                                        <Typography variant="body2" color="text.secondary">
                                            Created: {new Date(product.createdAt.seconds * 1000).toLocaleString()}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default ProductDetailPage;
