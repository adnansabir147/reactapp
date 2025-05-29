import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

// Material Kit 2 React Layout Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Material UI Components
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Box,
  Avatar,
  MenuItem,
  Select,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOption, setSortOption] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "Users", user.uid, "Orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        calculateGrandTotal(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const calculateGrandTotal = (orders) => {
    const total = orders.reduce((sum, order) => {
      return (
        sum +
        order.items?.reduce((itemSum, item) => {
          return itemSum + item.price * item.quantity;
        }, 0)
      );
    }, 0);
    setGrandTotal(total);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    const sorted = [...filteredOrders].sort((a, b) => {
      if (option === "price") {
        const aTotal = a.items?.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const bTotal = b.items?.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return bTotal - aTotal;
      } else if (option === "status") {
        return a.status?.localeCompare(b.status);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(sorted);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter((order) =>
      order.items?.some((item) => item.name.toLowerCase().includes(term)) ||
      order.status?.toLowerCase().includes(term)
    );

    setFilteredOrders(filtered);
    calculateGrandTotal(filtered);
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const rows = [["Order ID", "Date", "Status", "Item Name", "Quantity", "Price", "Total"]];
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        rows.push([
          order.id,
          new Date(order.createdAt).toLocaleString(),
          order.status,
          item.name,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_orders.csv");
    document.body.appendChild(link);
    link.click();
  };

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">My Orders</Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            Signed in as: {user?.email}
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              variant="outlined"
              placeholder="Search orders..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select value={sortOption} onChange={handleSortChange} size="small">
              <MenuItem value="createdAt">Sort by Date</MenuItem>
              <MenuItem value="status">Sort by Status</MenuItem>
              <MenuItem value="price">Sort by Total Price</MenuItem>
            </Select>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
              startIcon={<DownloadIcon />}
              onClick={exportCSV}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {filteredOrders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Grand Total: <strong>${grandTotal.toFixed(2)}</strong>
            </Typography>

            {currentOrders.map((order) => {
              const orderTotal = order.items?.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ) || 0;

              return (
                <Card key={order.id} sx={{ mb: 4, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order ID: {order.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Status: <strong>{order.status || "Processing"}</strong>
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                      Order Total: ${orderTotal.toFixed(2)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      {order.items?.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              border: "1px solid #eee",
                              borderRadius: 2,
                              p: 2,
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <Avatar
                              variant="rounded"
                              src={item.thumbnail || "https://via.placeholder.com/80"}
                              alt={item.name}
                              sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {item.name}
                              </Typography>
                              <Typography variant="body2">
                                Quantity: {item.quantity}
                              </Typography>
                              <Typography variant="body2">
                                Price: ${item.price}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                Total: ${item.price * item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}

            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default MyOrdersPage;
