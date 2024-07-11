export default {
  name: 'challenge',
  title: 'challenge',
  type: 'document',
  fields: [
    {
      name: 'challengeId',
      title: 'challengeId',
      type: 'string',
    },
    {
      name: 'challengeTime',
      title: 'challengeTime',
      type: 'number',
    },
    {
      name: 'isFinished',
      title: 'isFinished',
      type: 'boolean',
    },
		{
      name: 'users',
      title: 'users',
      type: 'array',
      of: [
        {
          name: 'user',
          title: 'user',
          type: 'object',
          fields: [
						{
							name: 'userId',
							title: 'userId',
							type: 'number'
						},
						{
							name: 'name',
							title: 'name',
							type: 'string'
						},
						{
							name: 'days',
							title: 'days',
							type: 'array',
							of: [
								{
									name: 'day',
									title: 'day',
									type: 'object',
									fields: [
										{
											name: 'todayTime',
											title: 'todayTime',
											type: 'number'
										},
										{
											name: 'date',
											title: 'date',
											type: 'date'
										}
									],
								},
							],
						}
					],
        },
      ],
    }
  ],
}