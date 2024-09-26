export default {
  name: 'user',
  title: 'user',
  type: 'document',
  fields: [
    {
      name: 'todayTime',
      title: 'todayTime',
      type: 'number',
    },
    {
      name: 'lastTimeEntryDate',
      title: 'lastTimeEntryDate',
      type: 'date',
    },
    {
      name: 'topRecordOnDay',
      title: 'topRecordOnDay',
      type: 'number',
    },
    {
      name: 'lastTimeEntry',
      title: 'lastTimeEntry',
      type: 'number',
    },
    {
      name: 'allTime',
      title: 'allTime',
      type: 'number',
    },
    {
      name: 'id',
      title: 'id',
      type: 'number',
    },
    {
      name: 'name',
      title: 'name',
      type: 'string',
    },
    {
      name: 'rankCode',
      title: 'rankCode',
      type: 'number',
    }
  ],
}