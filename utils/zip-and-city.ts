import formidable from 'formidable';
import { GetServerSidePropsContext, PreviewData } from 'next/types';
import { ParsedUrlQuery } from 'querystring';
import { assertIsString } from './assert';

export function zipAndCityFromUrl(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) {
  const { zip, city } = context.query;
  assertIsString(zip);
  assertIsString(city);
  return {
    zip,
    city,
  };
}

export async function zipAndCityFromForm(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) {
  const form = formidable();
  return await new Promise<{
    zip?: string;
    city?: string;
  }>((resolve, reject) => {
    form.parse(context.req, (err, fields) => {
      if (err) {
        return reject(err);
      }
      resolve({
        zip: !Array.isArray(fields.zip) ? fields.zip : undefined,
        city: !Array.isArray(fields.city) ? fields.city : undefined,
      });
    });
  });
}
