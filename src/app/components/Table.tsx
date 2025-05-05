import * as React from "react";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loader from "@/app/components/Loader";
import TablePagination from "@mui/material/TablePagination";


type TableProps = {
  columns: string[];
  rows: { id: number, data: (string | number | JSX.Element[])[] }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  isLoading?: boolean;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
}


const Table = ({ columns, rows, isLoading, pagination, handlePageChange, handlePageSizeChange }: TableProps) => {

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    handlePageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    handlePageSizeChange(newPageSize);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <TableContainer sx={{ maxHeight: 680 }}>
      <MUITable stickyHeader sx={{ minWidth: 650 }} aria-label="table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={column} align={index === 0 ? "inherit" : "right"}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.data.map((cell, index) => (
                <TableCell key={index} align={index === 0 ? "inherit" : "right"}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 20, 30]}
      component="div"
      count={pagination.totalItems}
      rowsPerPage={pagination.pageSize}
      page={pagination.page - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
    </Paper>
  );
}

export default Table