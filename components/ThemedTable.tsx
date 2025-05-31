import React from "react";
import { View, StyleSheet, DimensionValue } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

interface ThemedTableProps {
  data: { [key: string]: string | Array<string> | number }[];
  columns: {
    key: string;
    label: string;
    width?: DimensionValue;
    useRank?: boolean;
    useButton?: boolean;
    action?: string;
  }[];
  onPress?: (
    row: { [key: string]: string | Array<string> | number },
    action: string
  ) => void;
}

export function ThemedTable({ data, columns, onPress }: ThemedTableProps) {
  return (
    <ThemedView style={styles.tableContainer}>
      {/* Header */}
      <ThemedView style={styles.tableRow}>
        {columns.map((column, index) => (
          <ThemedText
            key={column.key}
            width={column.width}
            style={[
              styles.headerCell,
              index < columns.length - 1 ? styles.cellBorder : "",
              column.width ? "" : { flex: 1 },
            ]}
          >
            {column.label}
          </ThemedText>
        ))}
      </ThemedView>
      {/* Rows */}
      {data.map((row, index) => (
        <ThemedView
          key={index}
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
          ]}
        >
          {columns.map((column, index) =>
            Array.isArray(row[column.key]) ? (
              <ThemedView
                key={column.key}
                width={column.width}
                style={[
                  index < columns.length - 1 ? styles.cellBorder : "",
                  column.width ? "" : { flex: 1 },
                ]}
              >
                {(row[column.key] as string[]).map((item: string, idx) => (
                  <ThemedText
                    style={[styles.bodyCell]}
                    key={column.key + item + idx}
                  >
                    {item}
                  </ThemedText>
                ))}
              </ThemedView>
            ) : column.useRank && column.width ? (
              <ThemedView
                key={column.key}
                width={column.width}
                style={[
                  index < columns.length - 1 ? styles.cellBorder : "",
                  column.width ? "" : { flex: 1 },
                  styles.bodyCell,
                  {
                    alignItems: "flex-start",
                  },
                ]}
              >
                <ThemedText
                  width={
                    ((column.width as number) *
                      (row[column.key] as number)) as number
                  }
                  style={[{ height: 4, backgroundColor: "lightblue" }]}
                ></ThemedText>
              </ThemedView>
            ) : column.useButton ? (
              <ThemedView
                key={column.key}
                width={column.width}
                style={[
                  index < columns.length - 1 ? styles.cellBorder : "",
                  column.width ? "" : { flex: 1 },
                  styles.bodyCell,
                ]}
              >
                <ThemedButton
                  size="small"
                  title={row[column.key] as string}
                  onPress={() => onPress && onPress(row, column.action!)} // Ensure onPress is defined
                ></ThemedButton>
              </ThemedView>
            ) : (
              <ThemedText
                key={column.key}
                width={column.width}
                style={[
                  index < columns.length - 1 ? styles.cellBorder : "",
                  styles.cellBorder,
                  styles.bodyCell,
                  column.width ? "" : { flex: 1 },
                ]}
              >
                {row[column.key]}
              </ThemedText>
            )
          )}
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "red",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    gap: 0,
  },
  cellBorder: {
    borderRightWidth: 1,
    borderRightColor: "#EEEEEE",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    display: "flex", // Ensure flexbox layout
    // backgroundColor: "red",
    // backgroundColor: "#F0F0F0",
  },
  bodyCell: {
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    display: "flex", // Ensure flexbox layout
    // backgroundColor: "red",
    paddingTop: 6,
    paddingBottom: 6,
  },
  evenRow: {
    // backgroundColor: "#FFFFFF",
  },
  oddRow: {
    // backgroundColor: "#F9F9F9",
  },
});
