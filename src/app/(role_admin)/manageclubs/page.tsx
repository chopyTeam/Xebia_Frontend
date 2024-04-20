"use client";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAllClubs } from "@/hooks/club";
import APIImageComponent from "@/hooks/imageAPI";
import ClubForm from "../../../components/manageclubs/ClubForm";
import DashboardContainer from "@/components/common/dashboardContainer/DashboardContainer";
import RatingStars from "@/components/common/ratingStars/RatingStars";
import DeleteWarning from "@/components/manageclubs/DeleteWarning";
import { MdEdit, MdDelete } from "react-icons/md";

export default function ManageClubs() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [deleteWarning, setDeleteWarning] = useState<boolean>(false);
  const [tempId, setTempId] = useState<number[]>([-1, -1]);

  const {
    data: clubsData,
    isLoading: clubsLoading,
    isError: clubsError,
    refetch: refetchClubs,
  } = useQuery("clubs", getAllClubs);

  useEffect(() => {
    if (!isOpen && !deleteWarning) {
      refetchClubs();
    }
  }, [isOpen, tempId]);

  return (
    <div className="flex flex-col items-center bg-mainWhite min-h-max py-8 space-y-6">
      {!isOpen ? (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-mainGreen text-mainWhite text-xl w-fit px-4 py-2 rounded"
          >
            Dodaj klub
          </button>
          {clubsLoading || clubsError ? (
            <div>Trwa ładowanie danych...</div>
          ) : (
            <div className="w-11/12 xl:w-3/5 space-y-8 md:space-y-2">
              {clubsData &&
                clubsData.content.map((club, index) => (
                  <DashboardContainer
                    key={index}
                    className="flex flex-col md:flex-row md:h-36 cursor-pointer"
                    clubId={club.id}
                  >
                    <div className="flex items-center w-40 p-4">
                      <APIImageComponent
                        imageId={club.logo.id}
                        type={club.logo.path}
                      />
                    </div>
                    <div className="flex flex-col justify-center w-full p-4">
                      <p className="text-base">{club.name}</p>
                      <p className="text-xs font-sans mb-2 text-wrap min-h-12 md:h-fit">
                        {club.description}
                      </p>
                      <div className="hidden md:flex flex-col justify-end space-y-1 h-full">
                        <p className="text-sm text-mainOrange text-wrap">
                          {club.location.name}
                        </p>
                        <span className="flex items-end space-x-8 text-xs">
                          <p>Liczba kortów: {club.courtsAmount}</p>
                          <span className="flex items-center space-x-1">
                            <p>Ocena:</p>
                            <RatingStars rating={club.rating} />
                          </span>
                        </span>
                      </div>
                    </div>
                    <span className="flex justify-end items-center p-4">
                      <div className="flex md:hidden flex-col justify-end space-y-1 h-full w-full">
                        <p className="text-xs 2xs:text-sm text-mainOrange">
                          {club.location.name}
                        </p>
                        <span className="flex flex-col 2xs:flex-row items-start xs:items-end space-x-0 2xs:space-x-4 text-xs">
                          <p>Liczba kortów: {club.courtsAmount}</p>
                          <span className="flex items-center space-x-1">
                            <p>Ocena:</p>
                            <RatingStars rating={club.rating} />
                          </span>
                        </span>
                      </div>
                      <span className="flex space-x-3 md:space-x-2 text-3xl md:text-2xl">
                        <MdEdit
                          onClick={(e: any) => {
                            e.preventDefault();
                            setIsUpdate(true);
                            setTempId([club.id, club.logo.id]);
                            setIsOpen(true);
                          }}
                          className="cursor-pointer hover:text-mainGreen"
                        />
                        <MdDelete
                          onClick={(e: any) => {
                            e.preventDefault();
                            setDeleteWarning(true);
                            setTempId([club.id, club.logo.id]);
                          }}
                          className="cursor-pointer hover:text-red-600"
                        />
                      </span>
                    </span>
                  </DashboardContainer>
                ))}
            </div>
          )}
          {deleteWarning && (
            <DeleteWarning
              deleteWarning={deleteWarning}
              setDeleteWarning={setDeleteWarning}
              tempId={tempId}
              setTempId={setTempId}
            />
          )}
        </>
      ) : (
        <ClubForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          tempId={tempId}
          setTempId={setTempId}
        />
      )}
    </div>
  );
}
