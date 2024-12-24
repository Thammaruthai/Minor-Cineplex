import { Button, HStack } from "@chakra-ui/react";

export default function Pagination({
  totalPages,
  siblingCount = 1,
  page,
  setPage,
}) {
  const generatePagination = () => {
    const pages = [];
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === 9 ||
        (i >= leftSiblingIndex && i <= rightSiblingIndex)
      ) {
        pages.push(i);
      } else if (i === leftSiblingIndex - 1 || i === rightSiblingIndex + 1) {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = generatePagination();

  const handlePageChange = (selectedPage) => {
    if (selectedPage === "..." || selectedPage === page) return;
    setPage(selectedPage);
  };

  return (
    <div className="mb-16">
      <HStack spacing={2}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left w-6 h-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        {pages.map((p, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(p)}
            cursor={p !== "..." ? "pointer" : "default"}
            bg={p === page ? "#21263F" : "#070C1B"}
            color={p === page ? "white" : "#8B93B0"}
            px="4"
            py="2"
            borderRadius="md"
            fontWeight={p === page ? "bold" : "normal"}
          >
            {p}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right w-6 h-6"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </HStack>
    </div>
  );
}
