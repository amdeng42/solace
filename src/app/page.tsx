"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import debounce from "lodash/debounce";
import type { Advocate, PaginatedResponse, SearchMetadata } from "@/app/types";
import client from "@/app/client";
import { useRouter, useSearchParams } from "next/navigation";
import Table from "@/app/components/Table";
import Typography from "@mui/material/Typography";
import { formatPhoneNumber } from "@/app/utils/phoneNumber";
import ButtonIcon from "@/app/components/ButtonIcon";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Select from "@/app/components/Select";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";

const COLUMNS = [
  "First Name",
  "Last Name",
  "City",
  "Degree",
  "Specialties",
  "Years of Experience",
  "Phone Number",
]

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const advancedSearchEnabled = searchParams.get("advancedSearch") === "true";
  
  // get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  // get specialty and city from URL
  const specialty = searchParams.get("specialty") || "";
  const city = searchParams.get("city") || "";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: currentPage,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // search state
  // const [advancedSearchEnabled, setAdvancedSearchEnabled] = useState(false);
  const [fetchSearchMetadataError, setFetchSearchMetadataError] = useState(false);
  const [searchMetadata, setSearchMetadata] = useState<SearchMetadata>({
    specialties: [],
    cities: [],
  })

  const onChangeSpecialty = (specialty: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("specialty", specialty);
    router.push(`?${params.toString()}`);
  }

  const onChangeCity = (city: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("city", city);
    router.push(`?${params.toString()}`);
  }

  const onResetAdvSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.delete("specialty");
    params.delete("city");
    router.push(`?${params.toString()}`);
  }

  const onChangeSearchType = () => {
    // reset search term and dropdown values
    setSearchTerm("");
    setDebouncedSearchTerm("");
    const newAdvancedSearchEnabled = searchParams.get("advancedSearch") === "true" ? "false" : "true";

    // reset params
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("pageSize", pageSize.toString());
    params.set("advancedSearch", newAdvancedSearchEnabled);
    router.push(`?${params.toString()}`);
  }

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
    
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    const fetchSearchMetadata = async () => {
      try {
        const response = await client.getSearchMetadata();
        setSearchMetadata(response);
      } catch (error) {
        // for simplcity, we don't surface the error to the user
        // but we do disable the advanced search button
        setFetchSearchMetadataError(true);
      }
    }
    fetchSearchMetadata();
  }, []);

  useEffect(() => {
    const fetchAdvocates = async () => {
      setIsLoading(true);
      try {
        const response: PaginatedResponse = await client.getAdvocates(
          debouncedSearchTerm,
          specialty,
          city,
          currentPage, 
          pageSize
        );
        
        setAdvocates(response.data);
        setPagination(response.pagination);
      } catch (error) {
        // TODO: surface error to the user here
        console.log("Unable to get advocates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, [debouncedSearchTerm, currentPage, pageSize, specialty, city]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    
    if (currentPage !== 1) {
      navigateToPage(1);
    }
  };

  const onResetSearch = () => {
    setSearchTerm("");
    if (currentPage !== 1) {
      navigateToPage(1);
    }
  };

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    // keep search term in URL if present
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("pageSize", pageSize.toString());
    router.push(`?${params.toString()}`);
  }


  const tableRows = useMemo(() => {
    return advocates.map((advocate) => ({
      id: advocate.id,
      data: [
        advocate.firstName,
        advocate.lastName,
        advocate.city,
        advocate.degree,
        advocate.specialties.map((s, i) => (
          <div key={`${i}-${s}`}>{s}</div>
        )),
        advocate.yearsOfExperience,
        formatPhoneNumber(advocate.phoneNumber),
      ]
    }));
  }, [advocates]);

  return (
    <main>
      <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: "rgb(38, 91, 78)", padding: "1.5rem" }}>
          <Typography variant="h5" component="h1" style={{ fontWeight: 300, color: "white" }}>
            Solace Advocates
          </Typography>
        </div>

        {!advancedSearchEnabled && (
          <div style={{ margin: "24px"}}>
            <TextField 
              label="Search advocates"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={onChangeSearch}
            />

            <ButtonIcon
              tooltip="Reset Search"
              onClick={onResetSearch}
              
            >
              <RestartAltIcon />
            </ButtonIcon>

            <ButtonIcon
              tooltip="Advanced Search"
              onClick={onChangeSearchType}
              disabled={fetchSearchMetadataError}
            >
              <TroubleshootIcon />
            </ButtonIcon>
          </div>
        )}


        {/* Advanced Search */}
        {advancedSearchEnabled && (
          <div style={{ margin: "24px", display: "flex", gap: "16px" }}>
            <Select
              label="Specialties"
              options={searchMetadata.specialties.map(v => ({ value: v, label: v }))}
              value={specialty}
              onChange={onChangeSpecialty}
            />

            <Select
              label="Cities"
              options={searchMetadata.cities.map(v => ({ value: v, label: v }))}
              value={city}
              onChange={onChangeCity}
            />

            <ButtonIcon
              tooltip="Reset Search"
              onClick={onResetAdvSearch}
              
            >
              <RestartAltIcon />
            </ButtonIcon>

            <ButtonIcon
              tooltip={"Quick Search"}
              onClick={onChangeSearchType}
              disabled={fetchSearchMetadataError}
            >
              <SearchIcon />
            </ButtonIcon>
          </div>
        )}

        <div style={{ margin: "24px"}}>
          <Table 
            columns={COLUMNS}
            rows={tableRows}
            pagination={pagination}
            isLoading={isLoading}
            handlePageChange={navigateToPage}
            handlePageSizeChange={handlePageSizeChange}
          />
        </div>
      </ThemeProvider>
    </main>
  );
}