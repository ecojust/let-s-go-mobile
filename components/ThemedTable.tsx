import React from "react";
import { View, StyleSheet, DimensionValue } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface ThemedTableProps {
  data: { [key: string]: string | Array<string> }[];
  columns: { key: string; label: string; width?: DimensionValue }[];
}

export function ThemedTable({ data, columns }: ThemedTableProps) {
  return (
    <ThemedView style={styles.tableContainer}>
      {/* Header */}
      <ThemedView style={styles.tableRow}>
        {columns.map((column) => (
          <ThemedText
            key={column.key}
            width={column.width}
            style={[
              styles.tableCell,
              styles.headerCell,
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
          {columns.map((column) =>
            Array.isArray(row[column.key]) ? (
              <ThemedView
                key={column.key}
                width={column.width}
                style={[column.width ? "" : { flex: 1 }]}
              >
                {(row[column.key] as string[]).map((item: string) => (
                  <ThemedText key={column.key + item}>{item}</ThemedText>
                ))}
              </ThemedView>
            ) : (
              <ThemedText
                key={column.key}
                width={column.width}
                style={[styles.tableCell, column.width ? "" : { flex: 1 }]}
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
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "red",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    gap: 2,
  },
  tableCell: {
    fontSize: 16,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#F0F0F0",
  },
  evenRow: {
    backgroundColor: "#FFFFFF",
  },
  oddRow: {
    backgroundColor: "#F9F9F9",
  },
});
