// src/layouts/products/EditProduct.js
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

// Material Kit 2 Components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    tags: "",
    thumbnail: "",
    images: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "Products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({
          ...data,
          price: data.price.toString(),
          discountPrice: data.discountPrice.toString(),
          stock: data.stock.toString(),
          tags: data.tags.join(","),
          images: data.images.join(",")
        });
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "Products", id), {
        ...product,
        price: parseFloat(product.price),
        discountPrice: parseFloat(product.discountPrice),
        stock: parseInt(product.stock),
        tags: product.tags.split(","),
        images: product.images.split(","),
        updatedAt: serverTimestamp()
      });
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" mb={2}>Edit Product</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {[
                    { label: "Name", name: "name" },
                    { label: "Description", name: "description" },
                    { label: "Price", name: "price" },
                    { label: "Discount Price", name: "discountPrice" },
                    { label: "Stock", name: "stock" },
                    { label: "Category", name: "category" },
                    { label: "Tags (comma separated)", name: "tags" },
                    { label: "Thumbnail URL", name: "thumbnail" },
                    { label: "Images (comma separated URLs)", name: "images" },
                  ].map((field) => (
                    <Grid item xs={12} sm={6} key={field.name}>
                      <MDInput
                        fullWidth
                        type="text"
                        label={field.label}
                        name={field.name}
                        value={product[field.name]}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}
                </Grid>
                <MDBox mt={3}>
                  <MDButton type="submit" color="success">Update Product</MDButton>
                </MDBox>
              </form>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditProduct;
