import { render } from "@testing-library/react";
import Table from "../../../app/components/baseComponents/components/table/table";

describe("Table", () => {
    it("should render the table with column names and rows", () => {
        const mockTableData = {
            columnNames: [
                { key: "rank", value: "Rank" },
                { key: "name", value: "Name" },
                { key: "totalScore", value: "Score" }
            ],
            rows: [
                { rank: 1, name: "Contestant A", totalScore: 100 },
                { rank: 2, name: "Contestant B", totalScore: 90 }
            ]
        };

        const { container } = render(<Table tableData={mockTableData} />);

        const table = container.querySelector("table");
        expect(table).toBeInTheDocument();

        const thead = table.querySelector("thead");
        expect(thead).toBeInTheDocument();

        const headerCells = thead.querySelectorAll("th");
        expect(headerCells).toHaveLength(3);
        expect(headerCells[0]).toHaveTextContent("Rank");
        expect(headerCells[1]).toHaveTextContent("Name");
        expect(headerCells[2]).toHaveTextContent("Score");

        const tbody = table.querySelector("tbody");
        expect(tbody).toBeInTheDocument();

        const rows = tbody.querySelectorAll("tr");
        expect(rows).toHaveLength(2);

        const firstRowCells = rows[0].querySelectorAll("td");
        expect(firstRowCells).toHaveLength(3);
        expect(firstRowCells[0]).toHaveTextContent("1");
        expect(firstRowCells[1]).toHaveTextContent("Contestant A");
        expect(firstRowCells[2]).toHaveTextContent("100");

        const secondRowCells = rows[1].querySelectorAll("td");
        expect(secondRowCells).toHaveLength(3);
        expect(secondRowCells[0]).toHaveTextContent("2");
        expect(secondRowCells[1]).toHaveTextContent("Contestant B");
        expect(secondRowCells[2]).toHaveTextContent("90");
    });

    it("should render the table with caption", () => {
        const mockTableData = {
            caption: "Test Caption",
            columnNames: [
                { key: "name", value: "Name" }
            ],
            rows: [
                { name: "Test" }
            ]
        };

        const { getByText } = render(<Table tableData={mockTableData} />);

        expect(getByText("Test Caption")).toBeInTheDocument();
    });

    it("should render the table with footer", () => {
        const mockTableData = {
            columnNames: [
                { key: "name", value: "Name" }
            ],
            rows: [
                { name: "Test" }
            ],
            tableFooterContent: [
                { footerValue: "Total", cellWidth: 1 }
            ]
        };

        const { container } = render(<Table tableData={mockTableData} />);

        const tfoot = container.querySelector("tfoot");
        expect(tfoot).toBeInTheDocument();

        const footerCells = tfoot.querySelectorAll("td");
        expect(footerCells).toHaveLength(1);
        expect(footerCells[0]).toHaveTextContent("Total");
    });
});