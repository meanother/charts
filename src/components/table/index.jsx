import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import cn from "classnames";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import css from "./styles.module.css";

export const TableComponent = () => {
  const [tableData, setTableData] = useState([]);
  const history = useHistory();

  async function getTableData() {
    const req = await axios("http://151.248.112.110:3000/api/evergreen/");
    setTableData(req.data.data);
  }

  useEffect(() => {
    getTableData();
  }, []);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
      opacity: "0.5",
      boxShadow: "0 0 2px 2px gray",
    },
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.info.dark,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  // nickname;followers_count;month_operations_count;service_tags; strategies(тут кол-во, разделить по запятой); year_relative_yield
  // __, Автор, Кол-во подписчиков, Кол-во операций, Тэги, Кол-во стратегий, Доходность

  function getStrategiesLangth(str) {
    return !!str ? str.split(",").length : 0;
  }

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <h1 className={css.title}>Мониторинг авторов "Пульс"</h1>
      </div>
      <Table
        sx={{
          minWidth: 650,
          maxWidth: 1150,
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "8px",
        }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Автор</StyledTableCell>
            <StyledTableCell align="right">Доходность</StyledTableCell>
            <StyledTableCell align="right">Кол-во операций</StyledTableCell>
            <StyledTableCell align="right">Тэги</StyledTableCell>
            <StyledTableCell align="right">Кол-во стратегий</StyledTableCell>
            <StyledTableCell align="right">Кол-во подписчиков</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <StyledTableRow
              key={row.nickname}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => history.push(`/${row.nickname}`)}
            >
              <StyledTableCell component="th" scope="row">
                {row.nickname}
              </StyledTableCell>
              <StyledTableCell align="right">
                <span
                  className={cn(css.colorNum, {
                    [css.red]: row.year_relative_yield < 0,
                    [css.green]: row.year_relative_yield > 0,
                  })}
                >
                  {row.year_relative_yield > 0
                    ? `+${row.year_relative_yield}`
                    : row.year_relative_yield}
                </span>
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.month_operations_count}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.service_tags}
              </StyledTableCell>
              <StyledTableCell align="right">
                {getStrategiesLangth(row.strategies)}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.followers_count}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
