
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, List, Eye } from "lucide-react";
import { Product } from "../contexts/CatalogContext";

interface ProductAnalyticsProps {
  products: Product[];
}

// For demo purposes, we'll generate random view counts
const generateRandomData = (products: Product[]) => {
  return products.map(product => ({
    ...product,
    views: Math.floor(Math.random() * 500) + 50,
    clickRate: Math.random() * 0.3 + 0.1, // 10-40% click rate
  }));
};

const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({ products }) => {
  const [analyticsData, setAnalyticsData] = React.useState<(Product & { views: number; clickRate: number })[]>([]);

  React.useEffect(() => {
    if (products.length > 0) {
      // In a real app, we would fetch this data from an analytics API
      // For now, we're generating mock data
      setAnalyticsData(generateRandomData(products));
    }
  }, [products]);

  // Sort products by views (most viewed first)
  const sortedProducts = [...analyticsData].sort((a, b) => b.views - a.views);

  // Calculate total views
  const totalViews = analyticsData.reduce((sum, product) => sum + product.views, 0);

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
        <h3 className="font-medium text-lg mb-2">Sem dados de análise</h3>
        <p className="text-gray-600">
          Adicione produtos ao seu catálogo para visualizar dados de análise.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Análise de Produtos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Visualizações dos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Produtos disponíveis no catálogo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média de Visualizações</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0 ? Math.round(totalViews / products.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Média de visualizações por produto
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho dos Produtos</CardTitle>
          <CardDescription>
            Acompanhe quais produtos estão sendo mais acessados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Visualizações</TableHead>
                <TableHead className="text-right">Taxa de Clique</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.views}</TableCell>
                  <TableCell className="text-right">
                    {(product.clickRate * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {((product.views / totalViews) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAnalytics;
