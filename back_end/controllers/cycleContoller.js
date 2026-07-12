import expressAsyncHandler from "express-async-handler";
import Applicationcycle from "../models/cycleModel.js";

//..@description--------------------------------------------create a cycle
//..@api----------------------------------------------------POST/api/cycle
//..@access---------------------------------------------------private
const createCycle=expressAsyncHandler(async(req ,res)=>{
    const existCycle=await Applicationcycle.findOne({status:"open"})
    if(existCycle){
        res.status(409)
        throw new Error("An onpen cycle already exist")
    }
     const {financialYear,cycleName,openningDate,closingDate}=req.body
     if (new Date(openningDate) >= new Date(closingDate)) {
    res.status(400);
    throw new Error("Closing date must be after opening date");
  } 
    if(!financialYear||!openningDate||!closingDate){
        res.status(400)
        throw new Error("All the fields are mandatory")
    }
    const cycle=await Applicationcycle.create({
        financialYear,openningDate,cycleName,closingDate
    })
    res.status(201).json(cycle)
})

//..@description-------------------------------------update the ctcle 
//..@api----------------------------------------------POST/api/cycle/:id
//..@access---------------------------------------------private
const updateCycle = expressAsyncHandler(async (req, res) => {
    const cycle = await Applicationcycle.findById(req.params.id);
    if (!cycle) {
        res.status(404);
        throw new Error("The cycle does not exist");
    }

    const { financialYear, openingDate,cycleName, closingDate, status } = req.body;
    const newOpeningDate = openingDate || cycle.openingDate;
    const newClosingDate = closingDate || cycle.closingDate;
    if (
        status === "open" &&
        new Date(newOpeningDate) >= new Date(newClosingDate)
    ) {
        res.status(400);
        throw new Error("Closing date must be after opening date");
    }
    if (
        status === "closed" &&
        new Date(newClosingDate) < new Date(newOpeningDate)
    ) {
        res.status(400);
        throw new Error("Opening date must be before closing date");
    }
    cycle.financialYear = financialYear || cycle.financialYear;
    cycle.cycleName=cycleName||cycle.cycleName
    cycle.openingDate = newOpeningDate;
    cycle.closingDate = newClosingDate;
    cycle.status = status || cycle.status;
    const updatedCycle = await cycle.save();
    res.status(200).json(updatedCycle);
});

//..@description---------------------------------------------get all cycle
//..@api----------------------------------------------------GET/api/cycle
//..access----------------------------------------------------private
const getCycles = expressAsyncHandler(async (req, res) => {
  const cycles = await Applicationcycle.find().sort({ createdAt: -1 });
  res.status(200).json(cycles);
});

//..@descrition-------------------------------------------------get a sinhle cycle
//..@api-------------------------------------------------------GET/api/cycle/:id
//..access------------------------------------------------------private
const getCycle = expressAsyncHandler(async (req, res) => {
  const cycle = await Applicationcycle.findById(req.params.id);
  if (!cycle) {
    res.status(404);
    throw new Error("Cycle not found");
  }
  res.status(200).json(cycle);
});

//..@description-----------------------------------------------------get open cycle
//..api-----------------------------------------------------------GET/api/cycle/open
//..@access--------------------------------------------------------public
const getOpenCycle = expressAsyncHandler(async (req, res) => {
  const cycle = await Applicationcycle.findOne({
    status:"open",
  });
  if (!cycle) {
    res.status(404);
    throw new Error("No open cycle found");
  }
  res.status(200).json({data:cycle});
});

//..@description----------------------------------------------------delete a cycle
//..@api-------------------------------------------------------------DELETE/api/cycle/:id
//..@access-------------------------------------------------------------private
const deleteCycle = expressAsyncHandler(async (req, res) => {

  const { id } = req.params;

  const cycle = await Applicationcycle.findById(id);
  if (!cycle) {
    res.status(404);
    throw new Error("Cycle not found");
  }

  if (cycle.status === "open") {
    res.status(400);
    throw new Error("Cannot delete an active (open) cycle");
  }
  await Applicationcycle.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Cycle deleted successfully",
    deletedCycleId: id,
  });
});

export {createCycle,
    getCycles,
    getCycle,
    getOpenCycle,
    updateCycle,
    deleteCycle
}