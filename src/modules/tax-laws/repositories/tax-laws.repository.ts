import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';
import { Part, PartDocument } from '../schemas/part.schema';
import { Schedule, ScheduleDocument } from '../schemas/schedule.schema';
import {
  SearchIndex,
  SearchIndexDocument,
} from '../schemas/search-index.schema';
import { Section, SectionDocument } from '../schemas/section.schema';
import { SubSection, SubSectionDocument } from '../schemas/sub-section.schema';
import { TaxLaw, TaxLawDocument } from '../schemas/tax-law.schema';

@Injectable()
export class TaxLawsRepository {
  constructor(
    @InjectModel(TaxLaw.name)
    private readonly taxLawModel: Model<TaxLawDocument>,

    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,

    @InjectModel(Part.name)
    private readonly partModel: Model<PartDocument>,

    @InjectModel(Section.name)
    private readonly sectionModel: Model<SectionDocument>,

    @InjectModel(SubSection.name)
    private readonly subSectionModel: Model<SubSectionDocument>,

    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,

    @InjectModel(SearchIndex.name)
    private readonly searchIndexModel: Model<SearchIndexDocument>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  // async createFullTaxLawDocument(parsed: any) {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     // 1️⃣ Create the Parent TaxLaw
  //     const [taxLaw] = await this.taxLawModel.create(
  //       [
  //         {
  //           title: parsed.title,
  //           year: parsed.year,
  //           description: parsed.description,
  //         },
  //       ],
  //       { session },
  //     );

  //     const chapterIds: any[] = [];
  //     let totalSectionsCount = 0;

  //     console.log('parsed.chapters[0]:', parsed.chapters[0]);
  //     console.log('parsed.chapters[0].parts[0]:', parsed.chapters[0].parts[0]);

  //     for (const ch of parsed.chapters || []) {
  //       // 2️⃣ Create Chapter
  //       const [chapter] = await this.chapterModel.create(
  //         [
  //           {
  //             taxLaw: taxLaw._id,
  //             title: ch.title,
  //             number: ch.number,
  //           },
  //         ],
  //         { session },
  //       );
  //       chapterIds.push(chapter._id);

  //       const partIds: any[] = [];

  //       for (const pt of ch.parts || []) {
  //         // 3️⃣ Create Part
  //         const [part] = await this.partModel.create(
  //           [
  //             {
  //               chapter: chapter._id,
  //               title: pt.title,
  //               number: pt.number,
  //             },
  //           ],
  //           { session },
  //         );
  //         partIds.push(part._id);

  //         // --- OPTIMIZATION START ---
  //         // Instead of await inside the loop, we prepare all data first
  //         const sectionData: any[] = [];
  //         const allSubsections: any[] = [];

  //         for (const sec of pt.sections || []) {
  //           totalSectionsCount++;

  //           // Prepare subsections for this specific section
  //           const subs = (sec.subsections || []).map((s) => ({
  //             number: s.number,
  //             content: s.content,
  //             // Temporary field to link them back after insertion
  //             tempSectionId: sec.number,
  //           }));
  //           allSubsections.push(...subs);

  //           sectionData.push({
  //             part: part._id,
  //             title: sec.title,
  //             number: sec.number,
  //             content: sec.content,
  //             subsections: [], // Will fill this in a moment
  //           });
  //         }

  //         // 4️⃣ Bulk Insert Subsections for this Part
  //         const createdSubs = await this.subSectionModel.insertMany(
  //           allSubsections,
  //           { session },
  //         );

  //         // 5️⃣ Bulk Insert Sections for this Part
  //         // Map the created subsections back to their sections
  //         const sectionsToInsert = sectionData.map((secDoc) => {
  //           const relatedSubIds = createdSubs
  //             .filter((s) => (s as any).tempSectionId === secDoc.number)
  //             .map((s) => s._id);
  //           return { ...secDoc, subsections: relatedSubIds };
  //         });

  //         const createdSections = await this.sectionModel.insertMany(
  //           sectionsToInsert,
  //           { session },
  //         );
  //         const sectionIds = createdSections.map((s) => s._id);

  //         // 6️⃣ Link Sections to Part
  //         await this.partModel.updateOne(
  //           { _id: part._id },
  //           { sections: sectionIds },
  //           { session },
  //         );
  //       }

  //       // 7️⃣ Link Parts to Chapter
  //       await this.chapterModel.updateOne(
  //         { _id: chapter._id },
  //         { parts: partIds },
  //         { session },
  //       );
  //     }

  //     // 8️⃣ Bulk Insert Schedules
  //     if (parsed.schedules?.length) {
  //       const scheduleDocs = parsed.schedules.map((sch) => ({
  //         taxLaw: taxLaw._id,
  //         title: sch.title,
  //         number: sch.number,
  //         content: sch.content,
  //       }));
  //       const createdSchedules = await this.scheduleModel.insertMany(
  //         scheduleDocs,
  //         { session },
  //       );

  //       console.log('createdSchedules:', createdSchedules);

  //       const updatedTaxLaw = await this.taxLawModel.updateOne(
  //         { _id: taxLaw._id },
  //         {
  //           chapters: chapterIds,
  //           schedules: createdSchedules.map((s) => s._id),
  //           totalSections: totalSectionsCount,
  //         },
  //         { session },
  //       );
  //       console.log('updatedTaxLaw:', updatedTaxLaw);
  //     }

  //     await session.commitTransaction();
  //     return taxLaw;
  //   } catch (error) {
  //     if (session.inTransaction()) await session.abortTransaction();
  //     console.error('DETAILED REPO ERROR:', error);
  //     throw error;
  //   } finally {
  //     await session.endSession();
  //   }
  // }

  // async createFullTaxLawDocument(parsed: any) {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     const [taxLaw] = await this.taxLawModel.create(
  //       [
  //         {
  //           title: parsed.title,
  //           year: parsed.year,
  //           description: parsed.description,
  //         },
  //       ],
  //       { session },
  //     );

  //     let totalSectionsCount = 0;
  //     const chapterIds: any[] = [];

  //     for (const ch of parsed.chapters || []) {
  //       const [chapter] = await this.chapterModel.create(
  //         [{ taxLaw: taxLaw._id, title: ch.title, number: ch.number }],
  //         { session },
  //       );
  //       chapterIds.push(chapter._id);

  //       const partIds: any[] = [];

  //       for (const pt of ch.parts || []) {
  //         const [part] = await this.partModel.create(
  //           [{ chapter: chapter._id, title: pt.title, number: pt.number }],
  //           { session },
  //         );
  //         partIds.push(part._id);

  //         // 1. Prepare Sections (without subsections yet)
  //         const sectionData: any[] = pt.sections.map((sec) => ({
  //           part: part._id,
  //           title: sec.title,
  //           number: sec.number,
  //           content: sec.content,
  //           subsections: [],
  //         }));

  //         // 2. Bulk Insert Sections first to get their IDs
  //         const createdSections = await this.sectionModel.insertMany(
  //           sectionData,
  //           { session },
  //         );
  //         totalSectionsCount += createdSections.length;

  //         const allSubsections: any[] = [];

  //         // 3. Prepare Subsections using the real Section IDs we just created
  //         pt.sections.forEach((sec, index) => {
  //           const sectionId = createdSections[index]._id;

  //           if (sec.subsections && sec.subsections.length > 0) {
  //             const subs = sec.subsections.map((s) => ({
  //               section: sectionId, // <--- Now we have the required ID!
  //               number: s.number,
  //               content: s.content,
  //             }));
  //             allSubsections.push(...subs);
  //           }
  //         });

  //         // 4. Bulk Insert Subsections
  //         if (allSubsections.length > 0) {
  //           const createdSubs = await this.subSectionModel.insertMany(
  //             allSubsections,
  //             { session },
  //           );

  //           // 5. Link Subsections back to Sections (Bulk Update)
  //           // We use bulkWrite for maximum performance to avoid timeout
  //           const bulkUpdateOps = createdSections.map((secDoc) => {
  //             const relatedSubIds = createdSubs
  //               .filter(
  //                 (sub) => sub.section.toString() === secDoc._id.toString(),
  //               )
  //               .map((sub) => sub._id);

  //             return {
  //               updateOne: {
  //                 filter: { _id: secDoc._id },
  //                 update: { $set: { subsections: relatedSubIds } },
  //               },
  //             };
  //           });

  //           await this.sectionModel.bulkWrite(bulkUpdateOps, { session });
  //         }

  //         // 6. Link Sections to Part
  //         await this.partModel.updateOne(
  //           { _id: part._id },
  //           { sections: createdSections.map((s) => s._id) },
  //           { session },
  //         );
  //       }

  //       await this.chapterModel.updateOne(
  //         { _id: chapter._id },
  //         { parts: partIds },
  //         { session },
  //       );
  //     }

  //     // 7. Handle Schedules
  //     const scheduleIds: any[] = [];
  //     if (parsed.schedules?.length) {
  //       const createdSchedules = await this.scheduleModel.insertMany(
  //         parsed.schedules.map((sch) => ({ ...sch, taxLaw: taxLaw._id })),
  //         { session },
  //       );
  //       scheduleIds.push(...createdSchedules.map((s) => s._id));
  //     }

  //     // 8. Final TaxLaw Update
  //     await this.taxLawModel.updateOne(
  //       { _id: taxLaw._id },
  //       {
  //         chapters: chapterIds,
  //         schedules: scheduleIds,
  //         totalSections: totalSectionsCount,
  //       },
  //       { session },
  //     );

  //     await session.commitTransaction();
  //     return taxLaw;
  //   } catch (error) {
  //     if (session.inTransaction()) await session.abortTransaction();
  //     console.error('DETAILED REPO ERROR:', error);
  //     throw error;
  //   } finally {
  //     await session.endSession();
  //   }
  // }

  // async createFullTaxLawDocument(parsed: any) {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     const [taxLaw] = await this.taxLawModel.create(
  //       [
  //         {
  //           title: parsed.title,
  //           year: parsed.year,
  //           description: parsed.description,
  //         },
  //       ],
  //       { session },
  //     );

  //     let totalSectionsCount = 0;
  //     const chapterIds: any[] = [];

  //     console.log('parsed.chapters[0]:', parsed.chapters[0]);
  //     console.log('parsed.chapters[0].parts[0]:', parsed.chapters[0].parts[0]);
  //     for (const ch of parsed.chapters || []) {
  //       const [chapter] = await this.chapterModel.create(
  //         [{ taxLaw: taxLaw._id, title: ch.title, number: ch.number }],
  //         { session },
  //       );
  //       chapterIds.push(chapter._id);

  //       const partIds: any[] = [];

  //       for (const pt of ch.parts || []) {
  //         const [part] = await this.partModel.create(
  //           [{ chapter: chapter._id, title: pt.title, number: pt.number }],
  //           { session },
  //         );
  //         partIds.push(part._id);

  //         // 1. Prepare Sections (Lean objects)
  //         const sectionData = pt.sections.map((sec) => ({
  //           part: part._id,
  //           title: sec.title,
  //           number: sec.number,
  //           content: sec.content,
  //           subsections: [],
  //         }));

  //         // 2. Insert Sections - Use { lean: true } or convert result to save RAM
  //         const createdSections = await this.sectionModel.insertMany(
  //           sectionData,
  //           { session, lean: true },
  //         );
  //         totalSectionsCount += createdSections.length;

  //         // 3. Prepare Subsections
  //         const allSubsections: any[] = [];
  //         pt.sections.forEach((sec, index) => {
  //           const sectionId = createdSections[index]._id;
  //           if (sec.subsections?.length > 0) {
  //             sec.subsections.forEach((s) => {
  //               allSubsections.push({
  //                 section: sectionId,
  //                 number: s.number,
  //                 content: s.content,
  //               });
  //             });
  //           }
  //         });

  //         if (allSubsections.length > 0) {
  //           // 4. Insert Subsections
  //           const createdSubs = await this.subSectionModel.insertMany(
  //             allSubsections,
  //             { session, lean: true },
  //           );

  //           // 5. MEMORY EFFICIENT LINKING: Use a Map for O(1) lookup instead of .filter()
  //           // This prevents the CPU/Memory spike during heavy array iterations
  //           const subMap = new Map();
  //           createdSubs.forEach((sub) => {
  //             const sId = sub.section.toString();
  //             if (!subMap.has(sId)) subMap.set(sId, []);
  //             subMap.get(sId).push(sub._id);
  //           });

  //           const bulkUpdateOps = createdSections.map((secDoc) => ({
  //             updateOne: {
  //               filter: { _id: secDoc._id },
  //               update: {
  //                 $set: {
  //                   subsections: subMap.get(secDoc._id.toString()) || [],
  //                 },
  //               },
  //             },
  //           }));

  //           await this.sectionModel.bulkWrite(bulkUpdateOps, { session });
  //         }

  //         // 6. Link Sections to Part
  //         const partRes = await this.partModel.updateOne(
  //           { _id: part._id },
  //           { sections: createdSections.map((s) => s._id) },
  //           { session },
  //         );

  //         console.log('partRes:', partRes);
  //       }

  //       const chapterRes = await this.chapterModel.updateOne(
  //         { _id: chapter._id },
  //         { parts: partIds },
  //         { session },
  //       );
  //       console.log('chapterRes:', chapterRes);
  //     }

  //     // 7. Schedules
  //     const scheduleIds: any[] = [];
  //     if (parsed.schedules?.length) {
  //       const createdSchedules = await this.scheduleModel.insertMany(
  //         parsed.schedules.map((sch) => ({ ...sch, taxLaw: taxLaw._id })),
  //         { session, lean: true },
  //       );
  //       scheduleIds.push(...createdSchedules.map((s) => s._id));
  //     }

  //     // 8. Final TaxLaw Update
  //     const taxRes = await this.taxLawModel.updateOne(
  //       { _id: taxLaw._id },
  //       {
  //         chapters: chapterIds,
  //         schedules: scheduleIds,
  //         totalSections: totalSectionsCount,
  //       },
  //       { session },
  //     );
  //     console.log('taxRes:', taxRes);

  //     await session.commitTransaction();
  //     return taxLaw;
  //   } catch (error) {
  //     if (session.inTransaction()) await session.abortTransaction();
  //     console.error('DETAILED REPO ERROR:', error);
  //     throw error;
  //   } finally {
  //     await session.endSession();
  //   }
  // }

  async createFullTaxLawDocument(parsed: any) {
    try {
      // 1️⃣ Create the Parent TaxLaw first
      const taxLaw = await this.taxLawModel.create({
        title: parsed.title,
        year: parsed.year,
        description: parsed.description,
      });

      let totalSectionsCount = 0;
      const chapterIds: any[] = [];

      console.log('parsed.chapters[0]:', parsed.chapters[0]);
      console.log('parsed.chapters[0].parts[0]:', parsed.chapters[0].parts[0]);
      console.log('parsed.chapters[0].parts[0]:', parsed.chapters[0].parts[0]);

      // Process one chapter at a time to stay safe with memory
      for (const ch of parsed.chapters || []) {
        const chapter = await this.chapterModel.create({
          taxLaw: taxLaw._id,
          title: ch.title,
          number: ch.number,
        });
        chapterIds.push(chapter._id);

        const partIds: any[] = [];

        for (const pt of ch.parts || []) {
          const part = await this.partModel.create({
            chapter: chapter._id,
            title: pt.title,
            number: pt.number,
          });
          partIds.push(part._id);

          // Prepare Sections
          const sectionData = pt.sections.map((sec) => ({
            part: part._id,
            title: sec.title,
            number: sec.number,
            content: sec.content,
            subsections: [],
          }));

          // Insert Sections and use .lean() or POJO to save RAM
          const createdSections =
            await this.sectionModel.insertMany(sectionData);
          totalSectionsCount += createdSections.length;

          const allSubsections: any[] = [];

          // Use a Map to associate section number with the new MongoDB ID
          const sectionNumberToIdMap = new Map();
          createdSections.forEach((s, index) => {
            sectionNumberToIdMap.set(pt.sections[index].number, s._id);
          });

          pt.sections.forEach((sec) => {
            const sectionId = sectionNumberToIdMap.get(sec.number);
            if (sec.subsections?.length > 0) {
              sec.subsections.forEach((s) => {
                allSubsections.push({
                  section: sectionId,
                  number: s.number,
                  content: s.content,
                });
              });
            }
          });

          if (allSubsections.length > 0) {
            const createdSubs =
              await this.subSectionModel.insertMany(allSubsections);

            // Group subsections by sectionId for bulk update
            const subMap = new Map();
            createdSubs.forEach((sub) => {
              const sId = sub.section.toString();
              if (!subMap.has(sId)) subMap.set(sId, []);
              subMap.get(sId).push(sub._id);
            });

            const bulkUpdateOps = createdSections.map((secDoc) => ({
              updateOne: {
                filter: { _id: secDoc._id },
                update: {
                  $set: {
                    subsections: subMap.get(secDoc._id.toString()) || [],
                  },
                },
              },
            }));

            await this.sectionModel.bulkWrite(bulkUpdateOps);
          }

          // Link Sections to Part
          await this.partModel.updateOne(
            { _id: part._id },
            { sections: createdSections.map((s) => s._id) },
          );
        }

        // Link Parts to Chapter
        await this.chapterModel.updateOne(
          { _id: chapter._id },
          { parts: partIds },
        );
      }

      // Handle Schedules
      const scheduleIds: any[] = [];
      if (parsed.schedules?.length) {
        const createdSchedules = await this.scheduleModel.insertMany(
          parsed.schedules.map((sch) => ({ ...sch, taxLaw: taxLaw._id })),
        );
        scheduleIds.push(...createdSchedules.map((s) => s._id));
      }

      // Final Tax Law Update
      await this.taxLawModel.updateOne(
        { _id: taxLaw._id },
        {
          chapters: chapterIds,
          schedules: scheduleIds,
          totalSections: totalSectionsCount,
        },
      );

      return taxLaw;
    } catch (error) {
      console.error('FAILED TO PROCESS TAX ACT:', error);
      // You might want to delete the taxLaw entry here if it failed mid-way
      throw error;
    }
  }

  async createFullTaxLawDocumentWithoutArray(parsed: any) {
    try {
      // 1️⃣ Create the Parent TaxLaw
      // We only store 'totalSections' here; 'chapters' and 'schedules' arrays are removed.
      const taxLaw = await this.taxLawModel.create({
        title: parsed.title,
        year: parsed.year,
        description: parsed.description,
        totalSections: 0, // Will update this at the very end
      });

      let totalSectionsCount = 0;

      for (const ch of parsed.chapters || []) {
        // 2️⃣ Create Chapter (Points to TaxLaw)
        const chapter = await this.chapterModel.create({
          taxLaw: taxLaw._id,
          title: ch.title,
          number: ch.number,
        });

        for (const pt of ch.parts || []) {
          // 3️⃣ Create Part (Points to Chapter)
          const part = await this.partModel.create({
            chapter: chapter._id,
            title: pt.title,
            number: pt.number,
          });

          // 4️⃣ Prepare Sections (Points to Part)
          const sectionData = pt.sections.map((sec) => ({
            part: part._id,
            taxLaw: taxLaw._id, // Adding TaxLaw ID here makes global searches much faster
            title: sec.title,
            number: sec.number,
            content: sec.content,
          }));

          const createdSections =
            await this.sectionModel.insertMany(sectionData);
          totalSectionsCount += createdSections.length;

          // 5️⃣ Prepare Subsections (Points to Section)
          const allSubsections: any[] = [];

          // Map section numbers to the newly created MongoDB IDs for linking
          const sectionNumToIdMap = new Map();
          createdSections.forEach((s, index) => {
            sectionNumToIdMap.set(pt.sections[index].number, s._id);
          });

          pt.sections.forEach((sec) => {
            const sectionId = sectionNumToIdMap.get(sec.number);
            if (sec.subsections?.length > 0) {
              sec.subsections.forEach((sub) => {
                allSubsections.push({
                  section: sectionId,
                  number: sub.number,
                  content: sub.content,
                });
              });
            }
          });

          // 6️⃣ Bulk Insert Subsections
          if (allSubsections.length > 0) {
            await this.subSectionModel.insertMany(allSubsections);
          }

          // Note: No more bulkUpdate on Section, and no more updateOne on Part!
        }
        // Note: No more updateOne on Chapter!
      }

      // 7️⃣ Handle Schedules (Points to TaxLaw)
      if (parsed.schedules?.length > 0) {
        await this.scheduleModel.insertMany(
          parsed.schedules.map((sch) => ({ ...sch, taxLaw: taxLaw._id })),
        );
      }

      // 8️⃣ Final simple update for the count
      await this.taxLawModel.updateOne(
        { _id: taxLaw._id },
        { totalSections: totalSectionsCount },
      );

      return taxLaw;
    } catch (error) {
      console.error('FAILED TO PROCESS TAX ACT:', error);
      throw error;
    }
  }

  async search() {}
  async findLawById(taxLawId: string) {
    /**
     * return the tax law document and add the id, number, and title of each section
     * when user click on the section that he wants, we fetch the section and attach the sub section ids, titles etc like
     * i will be doing for find law by id
     *
     * {
  "_id": "law12345",
  "title": "Nigeria Tax Act 2025",
  "sections": [
    { "id": "s1", "number": "1", "title": "Preliminary" },
    { "id": "s2", "number": "2", "title": "Administration" }
  ]
}
     */

    const id = new Types.ObjectId(taxLawId);

    const law = await this.taxLawModel.findById(id);
    return law;
  }
  async findSectionById(sectionId: string) {
    const id = new Types.ObjectId(sectionId);

    const section = await this.sectionModel.findById(id);

    return section;
  }
  async findSectionBySectionNumber(lawId: string, sectionNumber: string) {}
  async findSubSection(subSectionId: string) {
    const id = new Types.ObjectId(subSectionId);

    const subSection = await this.subSectionModel.findById(id);

    return subSection;
  }
  async findSubSectionBySubSectionNumber(
    lawId: string,
    sectionNumber: string,
    subSectionNumber: string,
  ) {}
}
